"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AssembleiasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssembleiasService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../config/prisma.service");
const sorteio_service_1 = require("./sorteio.service");
let AssembleiasService = AssembleiasService_1 = class AssembleiasService {
    constructor(prisma, sorteioService, eventEmitter) {
        this.prisma = prisma;
        this.sorteioService = sorteioService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(AssembleiasService_1.name);
    }
    async agendar(grupoId, dataRealizacao) {
        const grupo = await this.prisma.grupo.findUniqueOrThrow({ where: { id: grupoId } });
        const ultima = await this.prisma.assembleia.findFirst({
            where: { grupoId },
            orderBy: { numero: 'desc' },
        });
        const numero = (ultima?.numero ?? 0) + 1;
        const { seed, commitment } = this.sorteioService.gerarCommitment();
        const assembleia = await this.prisma.assembleia.create({
            data: {
                grupoId,
                numero,
                dataRealizacao,
                status: 'AGENDADA',
                commitment,
                seedSorteio: seed,
            },
        });
        this.logger.log(`Assembleia #${numero} agendada para grupo ${grupo.codigo}`);
        this.eventEmitter.emit('assembleia.agendada', {
            assembleiaId: assembleia.id,
            grupoId,
            dataRealizacao,
            numero,
            commitment,
        });
        return assembleia;
    }
    async buscarPorId(id) {
        const assembleia = await this.prisma.assembleia.findUnique({
            where: { id },
            include: { grupo: true, lances: true },
        });
        if (!assembleia)
            throw new common_1.NotFoundException(`Assembleia ${id} não encontrada`);
        return assembleia;
    }
    async listarPorGrupo(grupoId) {
        return this.prisma.assembleia.findMany({
            where: { grupoId },
            orderBy: { numero: 'desc' },
            select: {
                id: true, numero: true, dataRealizacao: true, status: true,
                commitment: true, ataUrl: true,
            },
        });
    }
    async ofertarLance(participanteId, dto) {
        const assembleia = await this.prisma.assembleia.findUniqueOrThrow({
            where: { id: dto.assembleiaId },
        });
        if (assembleia.status !== 'AGENDADA') {
            throw new common_1.BadRequestException('Não é possível ofertar lances para esta assembleia');
        }
        const prazoEncerrado = new Date(assembleia.dataRealizacao.getTime() - 60 * 60 * 1000);
        if (new Date() > prazoEncerrado) {
            throw new common_1.BadRequestException('Prazo para oferta de lances encerrado (1h antes da assembleia)');
        }
        const participante = await this.prisma.participante.findFirst({
            where: { id: participanteId, grupoId: assembleia.grupoId },
        });
        if (!participante)
            throw new common_1.ForbiddenException('Participante não pertence a este grupo');
        if (participante.status !== 'ATIVO') {
            throw new common_1.BadRequestException('Apenas participantes ativos podem ofertar lances');
        }
        const percentual = (dto.valorLance / Number(participante.valorCredito)) * 100;
        if (percentual < 1) {
            throw new common_1.BadRequestException('Valor mínimo do lance é 1% da carta de crédito');
        }
        await this.prisma.lance.updateMany({
            where: { assembleiaId: dto.assembleiaId, participanteId, status: 'PENDENTE' },
            data: { status: 'CANCELADO' },
        });
        return this.prisma.lance.create({
            data: {
                assembleiaId: dto.assembleiaId,
                participanteId,
                tipo: dto.tipo,
                valorOfertado: dto.valorLance,
                percentualCarta: percentual,
                status: 'PENDENTE',
            },
        });
    }
    async realizar(assembleiaId) {
        const assembleia = await this.prisma.assembleia.findUniqueOrThrow({
            where: { id: assembleiaId },
            include: { grupo: true },
        });
        if (assembleia.status !== 'AGENDADA') {
            throw new common_1.BadRequestException('Assembleia não está no status AGENDADA');
        }
        await this.prisma.assembleia.update({
            where: { id: assembleiaId },
            data: { status: 'EM_ANDAMENTO' },
        });
        const participantesAtivos = await this.prisma.participante.findMany({
            where: {
                grupoId: assembleia.grupoId,
                status: 'ATIVO',
            },
            select: { id: true, numeroCota: true },
        });
        const cotasAtivas = participantesAtivos.map((p) => p.numeroCota);
        const lanceVencedor = await this.processarLances(assembleiaId, cotasAtivas, assembleia);
        let cotaContemplacada;
        let tipoContemplacao;
        if (lanceVencedor) {
            cotaContemplacada = lanceVencedor.numeroCota;
            tipoContemplacao = lanceVencedor.tipo;
        }
        else {
            const resultado = this.sorteioService.realizarSorteio(assembleia.seedSorteio, cotasAtivas, assembleia.numero);
            cotaContemplacada = resultado.cotaContemplacada;
            tipoContemplacao = 'SORTEIO';
            await this.prisma.assembleia.update({
                where: { id: assembleiaId },
                data: { resultadoSorteio: resultado },
            });
        }
        const contemplado = participantesAtivos.find((p) => p.numeroCota === cotaContemplacada);
        await this.prisma.participante.update({
            where: { id: contemplado.id },
            data: {
                status: 'CONTEMPLADO',
                dataContemplacao: new Date(),
                tipoContemplacao,
            },
        });
        await this.prisma.assembleia.update({
            where: { id: assembleiaId },
            data: { status: 'REALIZADA' },
        });
        this.eventEmitter.emit('assembleia.realizada', {
            assembleiaId,
            grupoId: assembleia.grupoId,
            participanteContempladoId: contemplado.id,
            cotaContemplacada,
            tipoContemplacao,
        });
        this.logger.log(`Assembleia #${assembleia.numero} realizada. Contemplado: cota ${cotaContemplacada} (${tipoContemplacao})`);
        return { assembleiaId, cotaContemplacada, tipoContemplacao };
    }
    async verificarSorteio(assembleiaId, cotaInformada) {
        const assembleia = await this.prisma.assembleia.findUniqueOrThrow({
            where: { id: assembleiaId },
        });
        if (!assembleia.seedSorteio || !assembleia.resultadoSorteio) {
            return { verificado: false, motivo: 'Assembleia não possui dados de sorteio' };
        }
        const resultado = assembleia.resultadoSorteio;
        const cotasAtivas = resultado.ordenacaoCompleta;
        const legitimo = this.sorteioService.verificarResultado(assembleia.seedSorteio, cotasAtivas, assembleia.numero, cotaInformada);
        return {
            verificado: legitimo,
            seed: assembleia.seedSorteio,
            commitment: assembleia.commitment,
            cotaContemplacada: resultado.cotaContemplacada,
        };
    }
    async processarLances(assembleiaId, cotasAtivas, assembleia) {
        const lances = await this.prisma.lance.findMany({
            where: { assembleiaId, status: 'PENDENTE' },
            include: { participante: true },
            orderBy: { percentualCarta: 'desc' },
        });
        if (!lances.length)
            return null;
        const maiorPercentual = lances[0].percentualCarta;
        const empatados = lances.filter((l) => l.percentualCarta === maiorPercentual);
        let vencedor = empatados[0];
        if (empatados.length > 1) {
            const cotasEmpatadas = empatados.map((l) => l.participante.numeroCota);
            const resultado = this.sorteioService.realizarSorteio(assembleia.seedSorteio, cotasEmpatadas, assembleia.numero);
            vencedor = empatados.find((l) => l.participante.numeroCota === resultado.cotaContemplacada);
        }
        await this.prisma.lance.update({ where: { id: vencedor.id }, data: { status: 'VENCEDOR' } });
        await this.prisma.lance.updateMany({
            where: { assembleiaId, id: { not: vencedor.id } },
            data: { status: 'PERDEDOR' },
        });
        return { numeroCota: vencedor.participante.numeroCota, tipo: vencedor.tipo };
    }
    async processarAssembleiasAgendadas() {
        const agora = new Date();
        const assembleiasPendentes = await this.prisma.assembleia.findMany({
            where: {
                status: 'AGENDADA',
                dataRealizacao: { lte: agora },
            },
        });
        for (const assembleia of assembleiasPendentes) {
            try {
                await this.realizar(assembleia.id);
            }
            catch (err) {
                this.logger.error(`Erro ao realizar assembleia ${assembleia.id}`, err);
            }
        }
    }
};
exports.AssembleiasService = AssembleiasService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssembleiasService.prototype, "processarAssembleiasAgendadas", null);
exports.AssembleiasService = AssembleiasService = AssembleiasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sorteio_service_1.SorteioService,
        event_emitter_1.EventEmitter2])
], AssembleiasService);
//# sourceMappingURL=assembleias.service.js.map