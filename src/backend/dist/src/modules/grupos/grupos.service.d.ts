import { GruposRepository } from './grupos.repository';
import { CriarGrupoDto } from './dto/criar-grupo.dto';
export declare class GruposService {
    private readonly gruposRepository;
    constructor(gruposRepository: GruposRepository);
    criar(dto: CriarGrupoDto): Promise<{
        codigo: string;
        id: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        totalParticipantes: number;
        participantesAtivos: number;
        prazoMeses: number;
        taxaAdminPercentual: import("@prisma/client-runtime-utils").Decimal;
        fundoReservaPercentual: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusGrupo;
        dataInicio: Date | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    buscarPorId(id: string): Promise<{
        codigo: string;
        id: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        totalParticipantes: number;
        participantesAtivos: number;
        prazoMeses: number;
        taxaAdminPercentual: import("@prisma/client-runtime-utils").Decimal;
        fundoReservaPercentual: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusGrupo;
        dataInicio: Date | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    listarDisponiveis(categoria?: string): Promise<{
        codigo: string;
        id: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        totalParticipantes: number;
        participantesAtivos: number;
        prazoMeses: number;
        taxaAdminPercentual: import("@prisma/client-runtime-utils").Decimal;
        fundoReservaPercentual: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusGrupo;
        dataInicio: Date | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    adicionarParticipante(grupoId: string): Promise<{
        codigo: string;
        id: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        totalParticipantes: number;
        participantesAtivos: number;
        prazoMeses: number;
        taxaAdminPercentual: import("@prisma/client-runtime-utils").Decimal;
        fundoReservaPercentual: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusGrupo;
        dataInicio: Date | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    calcularParcelaMensal(valorCredito: number, prazoMeses: number, taxaAdminPercentual: number): number;
    private gerarCodigoGrupo;
}
