import { GruposService } from './grupos.service';
import { CriarGrupoDto } from './dto/criar-grupo.dto';
export declare class GruposController {
    private readonly gruposService;
    constructor(gruposService: GruposService);
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
    calcularParcela(valorCredito: string, prazoMeses: string, taxaAdmin: string): {
        parcelaMensal: number;
        totalPago: number;
        economiaVsFinanciamento: number;
    };
    private calcularEconomiaVsFinanciamento;
}
