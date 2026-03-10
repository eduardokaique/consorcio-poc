import { Response } from 'express';
import { RelatoriosService } from './relatorios.service';
import { SucorService } from './sucor.service';
import { ConfigService } from '@nestjs/config';
export declare class RelatoriosController {
    private readonly relatoriosService;
    private readonly sucorService;
    private readonly config;
    constructor(relatoriosService: RelatoriosService, sucorService: SucorService, config: ConfigService);
    resumo(inicio: string, fim: string): Promise<{
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
    inadimplencia(): Promise<{
        grupoId: string;
        codigo: string;
        categoria: import(".prisma/client").$Enums.Categoria;
        totalParticipantes: number;
        inadimplentes: number;
        taxaInadimplencia: number;
    }[]>;
    contemplacoes(inicio: string, fim: string): Promise<{
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
    fluxoCaixa(grupoId: string): Promise<any[]>;
    sucor(competencia: string, res: Response): Promise<void>;
}
