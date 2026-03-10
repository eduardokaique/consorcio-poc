import { NotificacoesService } from './notificacoes.service';
export declare class NotificacoesListener {
    private readonly notificacoes;
    private readonly logger;
    constructor(notificacoes: NotificacoesService);
    onContemplacao(payload: {
        usuarioEmail: string;
        usuarioNome: string;
        valor: number;
        grupoCode?: string;
        celular?: string;
    }): Promise<void>;
    onParcelaPaga(payload: {
        usuarioEmail?: string;
        usuarioNome?: string;
        numeroParcela?: number;
        valorParcela?: number;
    }): Promise<void>;
    onAssembleiaAgendada(payload: {
        commitment: string;
        grupoId: string;
        dataRealizacao: Date;
    }): Promise<void>;
}
