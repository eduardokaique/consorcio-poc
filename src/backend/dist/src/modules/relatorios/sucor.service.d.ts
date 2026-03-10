import { PrismaService } from '../../config/prisma.service';
interface SucorParams {
    cnpjAdministradora: string;
    nomeAdministradora: string;
    competencia: string;
}
export declare class SucorService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    gerarArquivo(params: SucorParams): Promise<Buffer>;
    private formatarHeader;
    private formatarGrupo;
    private formatarParticipante;
    private formatarAssembleia;
    private formatarTrailer;
    private formatarDecimal;
}
export {};
