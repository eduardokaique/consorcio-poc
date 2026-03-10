export declare enum TipoLance {
    LIVRE = "LIVRE",
    EMBUTIDO = "EMBUTIDO",
    FIXO = "FIXO"
}
export declare class OfertarLanceDto {
    assembleiaId: string;
    valorLance: number;
    tipo: TipoLance;
}
