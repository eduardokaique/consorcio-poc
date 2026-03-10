export declare enum TipoBem {
    IMOVEL_RESIDENCIAL = "imovel_residencial",
    IMOVEL_COMERCIAL = "imovel_comercial",
    VEICULO_NOVO = "veiculo_novo",
    VEICULO_USADO = "veiculo_usado",
    SERVICO = "servico"
}
export declare class AprovarCartaDto {
    aprovado: boolean;
    tipoBem?: string;
    motivoReprovacao?: string;
}
