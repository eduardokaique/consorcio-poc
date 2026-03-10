export declare enum CategoriaConsorcio {
    IMOVEL = "imovel",
    VEICULO_LEVE = "veiculo_leve",
    VEICULO_PESADO = "veiculo_pesado",
    SERVICO = "servico",
    MOTO = "moto"
}
export declare const LIMITES_POR_CATEGORIA: Record<CategoriaConsorcio, {
    min: number;
    max: number;
    prazoMax: number;
    taxaAdmin: number;
}>;
