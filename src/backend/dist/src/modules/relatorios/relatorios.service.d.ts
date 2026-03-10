import { PrismaService } from '../../config/prisma.service';
export declare class RelatoriosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resumoGeral(dataInicio: Date, dataFim: Date): Promise<{
        periodo: {
            inicio: string;
            fim: string;
        };
        consorciados: {
            ativos: number;
            inadimplentes: number;
        };
        grupos: {
            ativos: number;
        };
        financeiro: {
            totalArrecadado: number;
            receitaTaxaAdmin: number;
            fundoComum: number;
        };
        contemplacoes: {
            periodo: number;
        };
        taxaInadimplencia: number;
    }>;
    inadimplenciaPorGrupo(): Promise<{
        grupoId: string;
        codigo: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        totalParticipantes: number;
        inadimplentes: number;
        taxaInadimplencia: number;
    }[]>;
    contemplacoesPorPeriodo(dataInicio: Date, dataFim: Date): Promise<{
        usuario: {
            nome: string;
        };
        grupo: {
            categoria: import(".prisma/client").$Enums.Categoria;
            codigo: string;
        };
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        numeroCota: number;
        dataContemplacao: Date;
        tipoContemplacao: import(".prisma/client").$Enums.TipoContemplacao;
    }[]>;
    fluxoCaixaFundoComum(grupoId: string): Promise<any[]>;
}
