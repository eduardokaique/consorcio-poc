export declare enum MetodoPagamentoInicial {
    PIX = "pix",
    BOLETO = "boleto"
}
export declare class AderirGrupoDto {
    grupoId: string;
    metodoPrimeiraParcela: MetodoPagamentoInicial;
}
