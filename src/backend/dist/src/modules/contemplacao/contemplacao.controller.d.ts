import { ContemplacaoService } from './contemplacao.service';
import { AprovarCartaDto } from './dto/aprovar-carta.dto';
export declare class ContemplacaoController {
    private readonly contemplacaoService;
    constructor(contemplacaoService: ContemplacaoService);
    minhasCartas(usuarioId: string): Promise<{
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
    utilizarCarta(cartaId: string, body: {
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
    pendentes(): Promise<({
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
    aprovar(cartaId: string, dto: AprovarCartaDto): Promise<{
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
}
