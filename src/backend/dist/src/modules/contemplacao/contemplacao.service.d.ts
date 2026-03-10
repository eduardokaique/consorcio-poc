import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../config/prisma.service';
import { AprovarCartaDto } from './dto/aprovar-carta.dto';
export declare enum StatusAnalise {
    APROVADA = "APROVADA",
    REPROVADA = "REPROVADA",
    PENDENTE_DOCUMENTOS = "PENDENTE_DOCUMENTOS"
}
export declare class ContemplacaoService {
    private readonly prisma;
    private readonly eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    iniciarProcesso(participanteId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    }>;
    aprovarCarta(cartaId: string, dto: AprovarCartaDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    }>;
    utilizarCarta(cartaId: string, dadosBem: {
        tipo: string;
        valor: number;
        descricao: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    }>;
    concluirUtilizacao(cartaId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    }>;
    buscarPorParticipante(participanteId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    }[]>;
    listarPendentesAnalise(): Promise<({
        participante: {
            usuario: {
                nome: string;
                email: string;
            };
            grupo: {
                categoria: import(".prisma/client").$Enums.Categoria;
                codigo: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.StatusParticipante;
            criadoEm: Date;
            usuarioId: string;
            valorCredito: import("@prisma/client-runtime-utils").Decimal;
            grupoId: string;
            numeroCota: number;
            percentualPago: import("@prisma/client-runtime-utils").Decimal;
            dataAdesao: Date;
            dataContemplacao: Date | null;
            tipoContemplacao: import(".prisma/client").$Enums.TipoContemplacao | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.StatusCarta;
        criadoEm: Date;
        participanteId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        valorBem: import("@prisma/client-runtime-utils").Decimal | null;
        tipoBem: string | null;
        dataAprovacao: Date | null;
        dataValidade: Date;
    })[]>;
}
