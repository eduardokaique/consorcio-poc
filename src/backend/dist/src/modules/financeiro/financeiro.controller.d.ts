import { Request } from 'express';
import { FinanceiroService } from './financeiro.service';
export declare class FinanceiroController {
    private readonly financeiroService;
    constructor(financeiroService: FinanceiroService);
    extrato(participanteId: string, status?: string, pagina?: string): Promise<{
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
    gerarPix(parcelaId: string): Promise<import("./celcoin.service").CobrancaPix>;
    gerarBoleto(parcelaId: string): Promise<import("./celcoin.service").CobrancaBoleto>;
    webhookPix(payload: any, assinatura: string, req: Request): Promise<{
        processado: boolean;
        motivo?: undefined;
    } | {
        processado: boolean;
        motivo: string;
    }>;
    fundoComum(grupoId: string): Promise<{
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
