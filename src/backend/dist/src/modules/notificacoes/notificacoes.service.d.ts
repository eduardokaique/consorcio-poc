import { ConfigService } from '@nestjs/config';
export interface EmailPayload {
    para: string;
    assunto: string;
    htmlBody: string;
    textBody?: string;
}
export interface SmsPayload {
    celular: string;
    mensagem: string;
}
export declare class NotificacoesService {
    private readonly config;
    private readonly logger;
    private readonly ses;
    private readonly sns;
    private readonly fromEmail;
    constructor(config: ConfigService);
    enviarEmail(payload: EmailPayload): Promise<void>;
    enviarSms(payload: SmsPayload): Promise<void>;
    notificarContemplacao(params: {
        email: string;
        celular: string;
        nome: string;
        valor: number;
        grupoCode: string;
    }): Promise<void>;
    notificarParcelaPaga(params: {
        email: string;
        nome: string;
        numero: number;
        valor: number;
    }): Promise<void>;
    notificarParcelaVencendo(params: {
        email: string;
        celular: string;
        nome: string;
        numero: number;
        valor: number;
        dataVencimento: string;
    }): Promise<void>;
    notificarAssembleiaAgendada(params: {
        email: string;
        nome: string;
        grupoCode: string;
        dataAssembleia: string;
        commitment: string;
    }): Promise<void>;
    private isDev;
}
