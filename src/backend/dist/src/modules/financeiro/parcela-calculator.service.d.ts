export interface ComposicaoParcela {
    valorPrincipal: number;
    valorFundoComum: number;
    valorFundoReserva: number;
    valorTaxaAdmin: number;
    valorSeguro: number;
    valorTotal: number;
}
export interface ConfiguracaoGrupo {
    valorCredito: number;
    prazoMeses: number;
    taxaAdminPercentual: number;
    fundoReservaPercentual: number;
    incluiSeguro: boolean;
    taxaSeguroMensal?: number;
}
export declare class ParcelaCalculatorService {
    calcularParcela(config: ConfiguracaoGrupo): ComposicaoParcela;
    calcularReajuste(valorAtual: number, indicePercentual: number): {
        novoValor: number;
        valorReajuste: number;
    };
    calcularEncargosInadimplencia(valorParcela: number, diasAtraso: number): {
        multa: number;
        juros: number;
        total: number;
    };
    private arredondar;
}
