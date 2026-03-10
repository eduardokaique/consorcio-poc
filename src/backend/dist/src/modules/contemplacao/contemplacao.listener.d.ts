import { ContemplacaoService } from './contemplacao.service';
export declare class ContemplacaoListener {
    private readonly contemplacaoService;
    private readonly logger;
    constructor(contemplacaoService: ContemplacaoService);
    handleAssembleiaRealizada(payload: {
        participanteContempladoId: string;
    }): Promise<void>;
}
