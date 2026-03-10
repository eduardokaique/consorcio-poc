import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export interface CobrancaPix {
    txid: string;
    qrCode: string;
    copiaCola: string;
    valor: number;
    expiracao: string;
}
export interface CobrancaBoleto {
    nossoNumero: string;
    linhaDigitavel: string;
    codigoBarras: string;
    valor: number;
    vencimento: string;
    url: string;
}
export interface StatusPagamento {
    txid: string;
    status: 'ATIVA' | 'CONCLUIDA' | 'REMOVIDA_PELO_USUARIO_RECEBEDOR' | 'REMOVIDA_PELO_PSP';
    valor?: number;
    horarioPagamento?: string;
}
export declare class CelcoinService {
    private readonly http;
    private readonly config;
    private readonly logger;
    private accessToken;
    private tokenExpira;
    constructor(http: HttpService, config: ConfigService);
    gerarCobrancaPix(txid: string, valor: number, descricao: string, expiracaoSegundos?: number): Promise<CobrancaPix>;
    gerarBoleto(nossoNumero: string, valor: number, dataVencimento: Date, pagador: {
        nome: string;
        cpf: string;
    }): Promise<CobrancaBoleto>;
    consultarStatusPix(txid: string): Promise<StatusPagamento>;
    validarAssinaturaWebhook(payload: string, assinaturaRecebida: string): boolean;
    private obterToken;
    private isDev;
    private mockPix;
    private mockBoleto;
}
