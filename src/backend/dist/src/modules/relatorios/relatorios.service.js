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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let RelatoriosService = class RelatoriosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resumoGeral(dataInicio, dataFim) {
        const [totalConsorciados, totalGrupos, arrecadacao, inadimplentes, contemplacoes,] = await Promise.all([
            this.prisma.participante.count({ where: { status: 'ATIVO' } }),
            this.prisma.grupo.count({ where: { status: { in: ['FORMANDO', 'ATIVO'] } } }),
            this.prisma.parcela.aggregate({
                where: { status: 'PAGA', dataPagamento: { gte: dataInicio, lte: dataFim } },
                _sum: { valorTotal: true, valorTaxaAdmin: true, valorFundoComum: true },
            }),
            this.prisma.participante.count({ where: { status: 'INADIMPLENTE' } }),
            this.prisma.participante.count({
                where: { status: 'CONTEMPLADO', dataContemplacao: { gte: dataInicio, lte: dataFim } },
            }),
        ]);
        const totalAtivos = totalConsorciados + inadimplentes;
        return {
            periodo: { inicio: dataInicio.toISOString(), fim: dataFim.toISOString() },
            consorciados: { ativos: totalConsorciados, inadimplentes },
            grupos: { ativos: totalGrupos },
            financeiro: {
                totalArrecadado: Number(arrecadacao._sum.valorTotal ?? 0),
                receitaTaxaAdmin: Number(arrecadacao._sum.valorTaxaAdmin ?? 0),
                fundoComum: Number(arrecadacao._sum.valorFundoComum ?? 0),
            },
            contemplacoes: { periodo: contemplacoes },
            taxaInadimplencia: totalAtivos > 0
                ? Number(((inadimplentes / totalAtivos) * 100).toFixed(2))
                : 0,
        };
    }
    async inadimplenciaPorGrupo() {
        const grupos = await this.prisma.grupo.findMany({
            where: { status: 'ATIVO' },
            include: {
                participantes: { select: { status: true } },
            },
        });
        return grupos
            .map((g) => {
            const ativos = g.participantes.filter((p) => p.status === 'ATIVO').length;
            const inadimplentes = g.participantes.filter((p) => p.status === 'INADIMPLENTE').length;
            const total = ativos + inadimplentes;
            return {
                grupoId: g.id,
                codigo: g.codigo,
                categoria: g.categoria,
                totalParticipantes: total,
                inadimplentes,
                taxaInadimplencia: total > 0 ? Number(((inadimplentes / total) * 100).toFixed(2)) : 0,
            };
        })
            .sort((a, b) => b.taxaInadimplencia - a.taxaInadimplencia);
    }
    async contemplacoesPorPeriodo(dataInicio, dataFim) {
        return this.prisma.participante.findMany({
            where: {
                status: 'CONTEMPLADO',
                dataContemplacao: { gte: dataInicio, lte: dataFim },
            },
            select: {
                numeroCota: true,
                tipoContemplacao: true,
                dataContemplacao: true,
                valorCredito: true,
                grupo: { select: { codigo: true, categoria: true } },
                usuario: { select: { nome: true } },
            },
            orderBy: { dataContemplacao: 'asc' },
        });
    }
    async fluxoCaixaFundoComum(grupoId) {
        const parcelas = await this.prisma.parcela.findMany({
            where: { participante: { grupoId }, status: 'PAGA' },
            select: {
                numero: true,
                valorFundoComum: true,
                valorTaxaAdmin: true,
                valorFundoReserva: true,
                valorTotal: true,
                dataPagamento: true,
            },
            orderBy: { dataPagamento: 'asc' },
        });
        const porMes = {};
        for (const p of parcelas) {
            const mes = p.dataPagamento.toISOString().substring(0, 7);
            if (!porMes[mes])
                porMes[mes] = { mes, arrecadado: 0, taxaAdmin: 0, fundoReserva: 0 };
            porMes[mes].arrecadado += Number(p.valorFundoComum);
            porMes[mes].taxaAdmin += Number(p.valorTaxaAdmin);
            porMes[mes].fundoReserva += Number(p.valorFundoReserva);
        }
        return Object.values(porMes);
    }
};
exports.RelatoriosService = RelatoriosService;
exports.RelatoriosService = RelatoriosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatoriosService);
//# sourceMappingURL=relatorios.service.js.map