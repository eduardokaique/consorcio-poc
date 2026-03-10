import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../config/prisma.service';
import { GruposService } from '../grupos/grupos.service';
import { KycService } from './kyc.service';
import { AderirGrupoDto } from './dto/aderir-grupo.dto';
export declare class ParticipantesService {
    private readonly prisma;
    private readonly gruposService;
    private readonly kycService;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, gruposService: GruposService, kycService: KycService, eventEmitter: EventEmitter2);
    aderirAGrupo(usuarioId: string, dto: AderirGrupoDto): Promise<{
        grupo: {
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
        };
        usuario: {
            email: string;
            nome: string;
        };
    } & {
        id: string;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusParticipante;
        criadoEm: Date;
        numeroCota: number;
        percentualPago: import("@prisma/client-runtime-utils").Decimal;
        dataAdesao: Date;
        dataContemplacao: Date | null;
        tipoContemplacao: import(".prisma/client").$Enums.TipoContemplacao | null;
        grupoId: string;
        usuarioId: string;
    }>;
    buscarPorId(id: string, usuarioId: string): Promise<{
        grupo: {
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
        };
        parcelas: {
            id: string;
            status: import(".prisma/client").$Enums.StatusParcela;
            criadoEm: Date;
            numero: number;
            participanteId: string;
            assembleiaId: string | null;
            valorPrincipal: import("@prisma/client-runtime-utils").Decimal;
            valorFundoComum: import("@prisma/client-runtime-utils").Decimal;
            valorFundoReserva: import("@prisma/client-runtime-utils").Decimal;
            valorTaxaAdmin: import("@prisma/client-runtime-utils").Decimal;
            valorSeguro: import("@prisma/client-runtime-utils").Decimal;
            valorTotal: import("@prisma/client-runtime-utils").Decimal;
            dataVencimento: Date;
            dataPagamento: Date | null;
            metodoPagamento: import(".prisma/client").$Enums.MetodoPagamento | null;
            txidPix: string | null;
        }[];
    } & {
        id: string;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusParticipante;
        criadoEm: Date;
        numeroCota: number;
        percentualPago: import("@prisma/client-runtime-utils").Decimal;
        dataAdesao: Date;
        dataContemplacao: Date | null;
        tipoContemplacao: import(".prisma/client").$Enums.TipoContemplacao | null;
        grupoId: string;
        usuarioId: string;
    }>;
    listarPorUsuario(usuarioId: string): Promise<({
        grupo: {
            codigo: string;
            categoria: import(".prisma/client").$Enums.Categoria;
            prazoMeses: number;
        };
        parcelas: {
            id: string;
            status: import(".prisma/client").$Enums.StatusParcela;
            criadoEm: Date;
            numero: number;
            participanteId: string;
            assembleiaId: string | null;
            valorPrincipal: import("@prisma/client-runtime-utils").Decimal;
            valorFundoComum: import("@prisma/client-runtime-utils").Decimal;
            valorFundoReserva: import("@prisma/client-runtime-utils").Decimal;
            valorTaxaAdmin: import("@prisma/client-runtime-utils").Decimal;
            valorSeguro: import("@prisma/client-runtime-utils").Decimal;
            valorTotal: import("@prisma/client-runtime-utils").Decimal;
            dataVencimento: Date;
            dataPagamento: Date | null;
            metodoPagamento: import(".prisma/client").$Enums.MetodoPagamento | null;
            txidPix: string | null;
        }[];
    } & {
        id: string;
        valorCredito: import("@prisma/client-runtime-utils").Decimal;
        status: import(".prisma/client").$Enums.StatusParticipante;
        criadoEm: Date;
        numeroCota: number;
        percentualPago: import("@prisma/client-runtime-utils").Decimal;
        dataAdesao: Date;
        dataContemplacao: Date | null;
        tipoContemplacao: import(".prisma/client").$Enums.TipoContemplacao | null;
        grupoId: string;
        usuarioId: string;
    })[]>;
    iniciarKyc(usuarioId: string): Promise<{
        url: string;
        sessionId: string;
    }>;
    processarWebhookKyc(sessionId: string, resultado: any): Promise<import("./kyc.service").ResultadoKyc>;
    private proximaCotaDisponivel;
}
