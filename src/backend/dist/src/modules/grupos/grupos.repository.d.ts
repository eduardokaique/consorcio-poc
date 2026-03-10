import { PrismaService } from '../../config/prisma.service';
import { CriarGrupoDto } from './dto/criar-grupo.dto';
export declare class GruposRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    criar(data: CriarGrupoDto & {
        codigo: string;
    }): Promise<{
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
    }>;
    buscarPorId(id: string): Promise<{
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
    }>;
    listarComVagas(categoria?: string): Promise<{
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
    }[]>;
    incrementarParticipantes(grupoId: string): Promise<{
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
    }>;
}
