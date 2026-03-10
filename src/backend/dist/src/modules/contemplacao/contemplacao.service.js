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
var ContemplacaoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContemplacaoService = exports.StatusAnalise = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../config/prisma.service");
var StatusAnalise;
(function (StatusAnalise) {
    StatusAnalise["APROVADA"] = "APROVADA";
    StatusAnalise["REPROVADA"] = "REPROVADA";
    StatusAnalise["PENDENTE_DOCUMENTOS"] = "PENDENTE_DOCUMENTOS";
})(StatusAnalise || (exports.StatusAnalise = StatusAnalise = {}));
let ContemplacaoService = ContemplacaoService_1 = class ContemplacaoService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(ContemplacaoService_1.name);
    }
    async iniciarProcesso(participanteId) {
        const participante = await this.prisma.participante.findUniqueOrThrow({
            where: { id: participanteId },
            include: { usuario: true, grupo: true },
        });
        if (participante.status !== 'CONTEMPLADO') {
            throw new common_1.BadRequestException('Participante não está contemplado');
        }
        const cartaExistente = await this.prisma.cartaCredito.findFirst({
            where: { participanteId },
        });
        if (cartaExistente)
            return cartaExistente;
        const validade = new Date();
        validade.setFullYear(validade.getFullYear() + 1);
        const carta = await this.prisma.cartaCredito.create({
            data: {
                participanteId,
                valor: participante.valorCredito,
                status: 'PENDENTE_ANALISE',
                dataValidade: validade,
            },
        });
        this.logger.log(`Carta de crédito iniciada para participante ${participanteId}`);
        this.eventEmitter.emit('contemplacao.iniciada', {
            participanteId,
            cartaId: carta.id,
            valor: participante.valorCredito,
            usuarioEmail: participante.usuario.email,
            usuarioNome: participante.usuario.nome,
        });
        return carta;
    }
    async aprovarCarta(cartaId, dto) {
        const carta = await this.prisma.cartaCredito.findUniqueOrThrow({
            where: { id: cartaId },
            include: { participante: { include: { usuario: true } } },
        });
        if (carta.status !== 'PENDENTE_ANALISE') {
            throw new common_1.BadRequestException(`Carta não está em análise (status: ${carta.status})`);
        }
        const novoStatus = dto.aprovado ? 'APROVADA' : 'PENDENTE_ANALISE';
        const cartaAtualizada = await this.prisma.cartaCredito.update({
            where: { id: cartaId },
            data: {
                status: novoStatus,
                dataAprovacao: dto.aprovado ? new Date() : null,
                tipoBem: dto.tipoBem,
            },
        });
        this.eventEmitter.emit(dto.aprovado ? 'carta.aprovada' : 'carta.reprovada', {
            cartaId,
            participanteId: carta.participanteId,
            valor: carta.valor,
            motivo: dto.motivoReprovacao,
            usuarioEmail: carta.participante.usuario.email,
        });
        return cartaAtualizada;
    }
    async utilizarCarta(cartaId, dadosBem) {
        const carta = await this.prisma.cartaCredito.findUniqueOrThrow({ where: { id: cartaId } });
        if (carta.status !== 'APROVADA') {
            throw new common_1.BadRequestException('Carta não está aprovada para uso');
        }
        if (new Date() > carta.dataValidade) {
            throw new common_1.BadRequestException('Carta de crédito expirada');
        }
        if (dadosBem.valor > Number(carta.valor)) {
            throw new common_1.BadRequestException(`Valor do bem (R$ ${dadosBem.valor.toLocaleString('pt-BR')}) excede o valor da carta (R$ ${Number(carta.valor).toLocaleString('pt-BR')})`);
        }
        const cartaAtualizada = await this.prisma.cartaCredito.update({
            where: { id: cartaId },
            data: {
                status: 'EM_USO',
                tipoBem: dadosBem.tipo,
                valorBem: dadosBem.valor,
            },
        });
        this.eventEmitter.emit('carta.em_uso', {
            cartaId,
            participanteId: carta.participanteId,
            tipoBem: dadosBem.tipo,
            valorBem: dadosBem.valor,
        });
        return cartaAtualizada;
    }
    async concluirUtilizacao(cartaId) {
        const carta = await this.prisma.cartaCredito.findUniqueOrThrow({ where: { id: cartaId } });
        if (carta.status !== 'EM_USO') {
            throw new common_1.BadRequestException('Carta não está em uso');
        }
        return this.prisma.cartaCredito.update({
            where: { id: cartaId },
            data: { status: 'UTILIZADA' },
        });
    }
    async buscarPorParticipante(participanteId) {
        return this.prisma.cartaCredito.findMany({
            where: { participanteId },
            orderBy: { criadoEm: 'desc' },
        });
    }
    async listarPendentesAnalise() {
        return this.prisma.cartaCredito.findMany({
            where: { status: 'PENDENTE_ANALISE' },
            include: {
                participante: {
                    include: {
                        usuario: { select: { nome: true, email: true } },
                        grupo: { select: { codigo: true, categoria: true } },
                    },
                },
            },
            orderBy: { criadoEm: 'asc' },
        });
    }
};
exports.ContemplacaoService = ContemplacaoService;
exports.ContemplacaoService = ContemplacaoService = ContemplacaoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ContemplacaoService);
//# sourceMappingURL=contemplacao.service.js.map