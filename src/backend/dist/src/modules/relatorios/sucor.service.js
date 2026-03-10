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
var SucorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let SucorService = SucorService_1 = class SucorService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SucorService_1.name);
    }
    async gerarArquivo(params) {
        const { cnpjAdministradora, nomeAdministradora, competencia } = params;
        const ano = parseInt(competencia.substring(0, 4));
        const mes = parseInt(competencia.substring(4, 6));
        const dataInicio = new Date(ano, mes - 1, 1);
        const dataFim = new Date(ano, mes, 0, 23, 59, 59);
        const [grupos, assembleias] = await Promise.all([
            this.prisma.grupo.findMany({
                where: { status: { in: ['ATIVO', 'ENCERRADO'] } },
                include: {
                    participantes: {
                        include: { parcelas: { where: { dataPagamento: { gte: dataInicio, lte: dataFim } } } },
                    },
                    assembleias: {
                        where: { dataRealizacao: { gte: dataInicio, lte: dataFim }, status: 'REALIZADA' },
                    },
                },
            }),
            this.prisma.assembleia.findMany({
                where: { dataRealizacao: { gte: dataInicio, lte: dataFim }, status: 'REALIZADA' },
                include: { grupo: true },
            }),
        ]);
        const linhas = [];
        linhas.push(this.formatarHeader(cnpjAdministradora, nomeAdministradora, competencia));
        let totalGrupos = 0;
        let totalParticipantes = 0;
        let totalAssembleias = 0;
        for (const grupo of grupos) {
            totalGrupos++;
            linhas.push(this.formatarGrupo(grupo, competencia));
            for (const participante of grupo.participantes) {
                totalParticipantes++;
                linhas.push(this.formatarParticipante(participante, grupo.codigo));
            }
            for (const assembleia of grupo.assembleias) {
                totalAssembleias++;
                linhas.push(this.formatarAssembleia(assembleia, grupo.codigo));
            }
        }
        linhas.push(this.formatarTrailer(totalGrupos, totalParticipantes, totalAssembleias));
        const conteudo = linhas.join('\r\n');
        this.logger.log(`SUCOR gerado: ${totalGrupos} grupos, ${totalParticipantes} participantes, ${totalAssembleias} assembleias`);
        return Buffer.from(conteudo, 'latin1');
    }
    formatarHeader(cnpj, nome, competencia) {
        return [
            '0',
            cnpj.replace(/\D/g, '').padStart(14, '0'),
            nome.substring(0, 40).padEnd(40, ' '),
            competencia,
            new Date().toISOString().split('T')[0].replace(/-/g, ''),
            '1',
        ].join('');
    }
    formatarGrupo(grupo, competencia) {
        const totalArrecadado = grupo.participantes.reduce((sum, p) => sum + p.parcelas.reduce((s, parc) => s + Number(parc.valorFundoComum ?? 0), 0), 0);
        return [
            '1',
            grupo.codigo.padEnd(20, ' '),
            grupo.categoria.padEnd(20, ' '),
            String(grupo.totalParticipantes).padStart(5, '0'),
            String(grupo.participantesAtivos).padStart(5, '0'),
            String(grupo.prazoMeses).padStart(3, '0'),
            this.formatarDecimal(Number(grupo.valorCredito), 15, 2),
            this.formatarDecimal(Number(grupo.taxaAdminPercentual), 5, 2),
            this.formatarDecimal(totalArrecadado, 15, 2),
            grupo.status.padEnd(10, ' '),
        ].join('');
    }
    formatarParticipante(participante, codigoGrupo) {
        const totalPago = participante.parcelas.reduce((sum, p) => sum + Number(p.valorTotal ?? 0), 0);
        return [
            '2',
            codigoGrupo.padEnd(20, ' '),
            String(participante.numeroCota).padStart(6, '0'),
            participante.status.padEnd(15, ' '),
            this.formatarDecimal(Number(participante.valorCredito), 15, 2),
            this.formatarDecimal(totalPago, 15, 2),
            this.formatarDecimal(Number(participante.percentualPago), 5, 2),
            participante.dataContemplacao
                ? new Date(participante.dataContemplacao).toISOString().split('T')[0].replace(/-/g, '')
                : '00000000',
        ].join('');
    }
    formatarAssembleia(assembleia, codigoGrupo) {
        const resultado = assembleia.resultadoSorteio;
        return [
            '3',
            codigoGrupo.padEnd(20, ' '),
            String(assembleia.numero).padStart(4, '0'),
            new Date(assembleia.dataRealizacao).toISOString().split('T')[0].replace(/-/g, ''),
            String(resultado?.cotaContemplacada ?? 0).padStart(6, '0'),
            (resultado?.tipoContemplacao ?? 'SORTEIO').padEnd(15, ' '),
            (assembleia.seedSorteio ?? '').substring(0, 64).padEnd(64, ' '),
        ].join('');
    }
    formatarTrailer(grupos, participantes, assembleias) {
        return [
            '9',
            String(grupos).padStart(6, '0'),
            String(participantes).padStart(8, '0'),
            String(assembleias).padStart(6, '0'),
            String(grupos + participantes + assembleias + 2).padStart(10, '0'),
        ].join('');
    }
    formatarDecimal(valor, inteiros, decimais) {
        const total = inteiros + decimais;
        return Math.round(valor * Math.pow(10, decimais)).toString().padStart(total, '0');
    }
};
exports.SucorService = SucorService;
exports.SucorService = SucorService = SucorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SucorService);
//# sourceMappingURL=sucor.service.js.map