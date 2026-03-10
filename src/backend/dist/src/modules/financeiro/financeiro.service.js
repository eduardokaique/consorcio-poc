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
var FinanceiroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroService = exports.MetodoPagamento = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../config/prisma.service");
const celcoin_service_1 = require("./celcoin.service");
const parcela_calculator_service_1 = require("./parcela-calculator.service");
var MetodoPagamento;
(function (MetodoPagamento) {
    MetodoPagamento["PIX"] = "pix";
    MetodoPagamento["BOLETO"] = "boleto";
    MetodoPagamento["DEBITO"] = "debito";
})(MetodoPagamento || (exports.MetodoPagamento = MetodoPagamento = {}));
let FinanceiroService = FinanceiroService_1 = class FinanceiroService {
    constructor(prisma, celcoin, calculator, eventEmitter) {
        this.prisma = prisma;
        this.celcoin = celcoin;
        this.calculator = calculator;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(FinanceiroService_1.name);
    }
    async gerarParcelas(participanteId) {
        const participante = await this.prisma.participante.findUniqueOrThrow({
            where: { id: participanteId },
            include: { grupo: true },
        });
        const { grupo } = participante;
        const composicao = this.calculator.calcularParcela({
            valorCredito: Number(participante.valorCredito),
            prazoMeses: grupo.prazoMeses,
            taxaAdminPercentual: Number(grupo.taxaAdminPercentual),
            fundoReservaPercentual: Number(grupo.fundoReservaPercentual),
            incluiSeguro: false,
        });
        const hoje = new Date();
        const parcelas = Array.from({ length: grupo.prazoMeses }, (_, i) => {
            const vencimento = new Date(hoje);
            vencimento.setMonth(vencimento.getMonth() + i + 1);
            vencimento.setDate(10);
            return {
                participanteId,
                numero: i + 1,
                valorPrincipal: composicao.valorPrincipal,
                valorFundoComum: composicao.valorFundoComum,
                valorFundoReserva: composicao.valorFundoReserva,
                valorTaxaAdmin: composicao.valorTaxaAdmin,
                valorSeguro: composicao.valorSeguro,
                valorTotal: composicao.valorTotal,
                dataVencimento: vencimento,
                status: 'PENDENTE',
            };
        });
        await this.prisma.parcela.createMany({ data: parcelas });
        this.logger.log(`${grupo.prazoMeses} parcelas geradas para participante ${participanteId}`);
        return parcelas.length;
    }
    async gerarPix(parcelaId) {
        const parcela = await this.prisma.parcela.findUniqueOrThrow({
            where: { id: parcelaId },
            include: { participante: { include: { usuario: { select: { nome: true } } } } },
        });
        if (parcela.status === 'PAGA') {
            throw new common_1.BadRequestException('Parcela já está paga');
        }
        const txid = `CP${parcelaId.replace(/-/g, '').substring(0, 26)}`;
        const cobranca = await this.celcoin.gerarCobrancaPix(txid, Number(parcela.valorTotal), `ConsorcioPro - Parcela ${parcela.numero}`);
        await this.prisma.parcela.update({
            where: { id: parcelaId },
            data: { txidPix: cobranca.txid },
        });
        return cobranca;
    }
    async gerarBoleto(parcelaId) {
        const parcela = await this.prisma.parcela.findUniqueOrThrow({
            where: { id: parcelaId },
            include: { participante: { include: { usuario: { select: { nome: true } } } } },
        });
        if (parcela.status === 'PAGA') {
            throw new common_1.BadRequestException('Parcela já está paga');
        }
        const nossoNumero = `CP${parcelaId.replace(/-/g, '').substring(0, 20)}`;
        return this.celcoin.gerarBoleto(nossoNumero, Number(parcela.valorTotal), new Date(parcela.dataVencimento), { nome: parcela.participante.usuario.nome, cpf: '00000000000' });
    }
    async processarWebhookPix(payload, assinatura, rawBody) {
        if (!this.celcoin.validarAssinaturaWebhook(rawBody, assinatura)) {
            throw new common_1.BadRequestException('Assinatura do webhook inválida');
        }
        const { txid, status, pix } = payload;
        if (status !== 'CONCLUIDA')
            return { processado: false };
        const parcela = await this.prisma.parcela.findFirst({ where: { txidPix: txid } });
        if (!parcela)
            return { processado: false, motivo: 'txid não encontrado' };
        if (parcela.status === 'PAGA')
            return { processado: false, motivo: 'idempotência' };
        await this.prisma.parcela.update({
            where: { id: parcela.id },
            data: {
                status: 'PAGA',
                dataPagamento: new Date(pix?.[0]?.horario ?? Date.now()),
                metodoPagamento: 'pix',
            },
        });
        this.eventEmitter.emit('parcela.paga', {
            parcelaId: parcela.id,
            participanteId: parcela.participanteId,
            metodo: MetodoPagamento.PIX,
            txid,
        });
        this.logger.log(`Parcela ${parcela.id} paga via Pix (txid: ${txid})`);
        return { processado: true };
    }
    async buscarExtrato(participanteId, filtroStatus, pagina = 1, limite = 12) {
        const where = {
            participanteId,
            ...(filtroStatus ? { status: filtroStatus } : {}),
        };
        const [parcelas, total] = await Promise.all([
            this.prisma.parcela.findMany({
                where,
                orderBy: { numero: 'asc' },
                skip: (pagina - 1) * limite,
                take: limite,
            }),
            this.prisma.parcela.count({ where }),
        ]);
        return { parcelas, total, pagina, totalPaginas: Math.ceil(total / limite) };
    }
    async calcularFundoComum(grupoId) {
        const [parcelas, cartas] = await Promise.all([
            this.prisma.parcela.aggregate({
                where: { participante: { grupoId }, status: 'PAGA' },
                _sum: { valorFundoComum: true, valorTaxaAdmin: true, valorFundoReserva: true },
            }),
            this.prisma.cartaCredito.aggregate({
                where: { participante: { grupoId }, status: { not: 'PENDENTE_ANALISE' } },
                _sum: { valor: true },
            }),
        ]);
        const arrecadado = Number(parcelas._sum.valorFundoComum ?? 0);
        const contemplado = Number(cartas._sum.valor ?? 0);
        return {
            grupoId,
            saldoFundoComum: arrecadado - contemplado,
            totalArrecadado: arrecadado,
            totalContemplado: contemplado,
            receitaTaxaAdmin: Number(parcelas._sum.valorTaxaAdmin ?? 0),
            fundoReserva: Number(parcelas._sum.valorFundoReserva ?? 0),
        };
    }
    async processarInadimplencias() {
        const { count } = await this.prisma.parcela.updateMany({
            where: { status: 'PENDENTE', dataVencimento: { lt: new Date() } },
            data: { status: 'VENCIDA' },
        });
        if (count > 0)
            this.eventEmitter.emit('inadimplencia.detectada', { quantidade: count });
        return { parcelasVencidas: count };
    }
};
exports.FinanceiroService = FinanceiroService;
exports.FinanceiroService = FinanceiroService = FinanceiroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        celcoin_service_1.CelcoinService,
        parcela_calculator_service_1.ParcelaCalculatorService,
        event_emitter_1.EventEmitter2])
], FinanceiroService);
//# sourceMappingURL=financeiro.service.js.map