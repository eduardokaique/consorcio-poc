import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../config/prisma.service';
import { CelcoinService } from './celcoin.service';
import { ParcelaCalculatorService } from './parcela-calculator.service';
export declare enum MetodoPagamento {
    PIX = "pix",
    BOLETO = "boleto",
    DEBITO = "debito"
}
export declare class FinanceiroService {
    private readonly prisma;
    private readonly celcoin;
    private readonly calculator;
    private readonly eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, celcoin: CelcoinService, calculator: ParcelaCalculatorService, eventEmitter: EventEmitter2);
    gerarParcelas(participanteId: string): Promise<number>;
    gerarPix(parcelaId: string): Promise<import("./celcoin.service").CobrancaPix>;
    gerarBoleto(parcelaId: string): Promise<import("./celcoin.service").CobrancaBoleto>;
    processarWebhookPix(payload: any, assinatura: string, rawBody: string): Promise<{
        processado: boolean;
        motivo?: undefined;
    } | {
        processado: boolean;
        motivo: string;
    }>;
    buscarExtrato(participanteId: string, filtroStatus?: string, pagina?: number, limite?: number): Promise<{
        parcelas: {
            id: string;
            status: import(".prisma/client").$Enums.StatusParcela;
            criadoEm: Date;
            numero: number;
            participanteId: string;
            assembleiaId: string | null;
            valorPrincipal: import("@prisma/client-runtime-utils").Decimal;
            valorFundoComum: import("@prisma/client-runtime-utils").Decimal;
            valorFundoReserva: import("@prisma/client-runtime-utils").Decimal;
            valorTaxaAdmin: import("@prisma/client-runtime-utils").Decimal;
            valorSeguro: import("@prisma/client-runtime-utils").Decimal;
            valorTotal: import("@prisma/client-runtime-utils").Decimal;
            dataVencimento: Date;
            dataPagamento: Date | null;
            metodoPagamento: import(".prisma/client").$Enums.MetodoPagamento | null;
            txidPix: string | null;
        }[];
        total: number;
        pagina: number;
        totalPaginas: number;
    }>;
    calcularFundoComum(grupoId: string): Promise<{
        grupoId: string;
        saldoFundoComum: number;
        totalArrecadado: number;
        totalContemplado: number;
        receitaTaxaAdmin: number;
        fundoReserva: number;
    }>;
    processarInadimplencias(): Promise<{
        parcelasVencidas: number;
    }>;
}
