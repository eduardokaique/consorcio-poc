import { FinanceiroService } from '../financeiro.service';
export declare class ParcelasListener {
    private readonly financeiroService;
    private readonly logger;
    constructor(financeiroService: FinanceiroService);
    handleParticipanteCriado(payload: {
        participanteId: string;
    }): Promise<void>;
    handleParcelaPaga(payload: {
        parcelaId: string;
        participanteId: string;
    }): Promise<void>;
}
