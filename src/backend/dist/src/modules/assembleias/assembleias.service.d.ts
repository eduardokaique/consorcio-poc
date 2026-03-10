import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../config/prisma.service';
import { SorteioService } from './sorteio.service';
import { OfertarLanceDto } from './dto/ofertar-lance.dto';
export declare class AssembleiasService {
    private readonly prisma;
    private readonly sorteioService;
    private readonly eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, sorteioService: SorteioService, eventEmitter: EventEmitter2);
    agendar(grupoId: string, dataRealizacao: Date): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusAssembleia;
        criadoEm: Date;
        grupoId: string;
        numero: number;
        dataRealizacao: Date;
        seedSorteio: string | null;
        commitment: string | null;
        resultadoSorteio: import("@prisma/client/runtime/client").JsonValue | null;
        ataUrl: string | null;
    }>;
    buscarPorId(id: string): Promise<{
        grupo: {
            id: string;
            status: import(".prisma/client").$Enums.StatusGrupo;
            criadoEm: Date;
            atualizadoEm: Date;
            categoria: import(".prisma/client").$Enums.Categoria;
            valorCredito: import("@prisma/client-runtime-utils").Decimal;
            prazoMeses: number;
            totalParticipantes: number;
            taxaAdminPercentual: import("@prisma/client-runtime-utils").Decimal;
            fundoReservaPercentual: import("@prisma/client-runtime-utils").Decimal;
            codigo: string;
            participantesAtivos: number;
            dataInicio: Date | null;
        };
        lances: {
            id: string;
            status: import(".prisma/client").$Enums.StatusLance;
            criadoEm: Date;
            participanteId: string;
            assembleiaId: string;
            tipo: import(".prisma/client").$Enums.TipoLance;
            valorOfertado: import("@prisma/client-runtime-utils").Decimal;
            percentualCarta: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.StatusAssembleia;
        criadoEm: Date;
        grupoId: string;
        numero: number;
        dataRealizacao: Date;
        seedSorteio: string | null;
        commitment: string | null;
        resultadoSorteio: import("@prisma/client/runtime/client").JsonValue | null;
        ataUrl: string | null;
    }>;
    listarPorGrupo(grupoId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusAssembleia;
        numero: number;
        dataRealizacao: Date;
        commitment: string;
        ataUrl: string;
    }[]>;
    ofertarLance(participanteId: string, dto: OfertarLanceDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusLance;
        criadoEm: Date;
        participanteId: string;
        assembleiaId: string;
        tipo: import(".prisma/client").$Enums.TipoLance;
        valorOfertado: import("@prisma/client-runtime-utils").Decimal;
        percentualCarta: import("@prisma/client-runtime-utils").Decimal;
    }>;
    realizar(assembleiaId: string): Promise<{
        assembleiaId: string;
        cotaContemplacada: number;
        tipoContemplacao: "SORTEIO" | "LANCE_LIVRE" | "LANCE_EMBUTIDO";
    }>;
    verificarSorteio(assembleiaId: string, cotaInformada: number): Promise<{
        verificado: boolean;
        motivo: string;
        seed?: undefined;
        commitment?: undefined;
        cotaContemplacada?: undefined;
    } | {
        verificado: boolean;
        seed: string;
        commitment: string;
        cotaContemplacada: any;
        motivo?: undefined;
    }>;
    private processarLances;
    processarAssembleiasAgendadas(): Promise<void>;
}
