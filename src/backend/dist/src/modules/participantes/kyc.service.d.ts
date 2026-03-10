import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare enum StatusKyc {
    APROVADO = "APROVADO",
    REPROVADO = "REPROVADO",
    PENDENTE = "PENDENTE",
    EM_ANALISE = "EM_ANALISE"
}
export interface ResultadoKyc {
    status: StatusKyc;
    protocolo: string;
    mensagem?: string;
}
export interface ValidacaoCpf {
    valido: boolean;
    situacao: 'REGULAR' | 'SUSPENSA' | 'CANCELADA' | 'INVALIDO';
    nome?: string;
    dataNascimento?: string;
}
export declare class KycService {
    private readonly http;
    private readonly config;
    private readonly logger;
    constructor(http: HttpService, config: ConfigService);
    validarCpf(cpf: string): Promise<ValidacaoCpf>;
    iniciarKyc(usuarioId: string, nome: string): Promise<{
        url: string;
        sessionId: string;
    }>;
    processarResultadoKyc(sessionId: string, resultado: any): Promise<ResultadoKyc>;
    private validarDigitosVerificadoresCpf;
    private mapSituacaoCpf;
    private obterTokenSerpro;
}
