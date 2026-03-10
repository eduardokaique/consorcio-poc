"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIMITES_POR_CATEGORIA = exports.CategoriaConsorcio = void 0;
var CategoriaConsorcio;
(function (CategoriaConsorcio) {
    CategoriaConsorcio["IMOVEL"] = "imovel";
    CategoriaConsorcio["VEICULO_LEVE"] = "veiculo_leve";
    CategoriaConsorcio["VEICULO_PESADO"] = "veiculo_pesado";
    CategoriaConsorcio["SERVICO"] = "servico";
    CategoriaConsorcio["MOTO"] = "moto";
})(CategoriaConsorcio || (exports.CategoriaConsorcio = CategoriaConsorcio = {}));
exports.LIMITES_POR_CATEGORIA = {
    [CategoriaConsorcio.IMOVEL]: {
        min: 100_000,
        max: 1_500_000,
        prazoMax: 240,
        taxaAdmin: 13,
    },
    [CategoriaConsorcio.VEICULO_LEVE]: {
        min: 30_000,
        max: 250_000,
        prazoMax: 84,
        taxaAdmin: 12,
    },
    [CategoriaConsorcio.VEICULO_PESADO]: {
        min: 100_000,
        max: 500_000,
        prazoMax: 100,
        taxaAdmin: 13,
    },
    [CategoriaConsorcio.SERVICO]: {
        min: 5_000,
        max: 30_000,
        prazoMax: 36,
        taxaAdmin: 10,
    },
    [CategoriaConsorcio.MOTO]: {
        min: 5_000,
        max: 40_000,
        prazoMax: 60,
        taxaAdmin: 11,
    },
};
//# sourceMappingURL=categoria.enum.js.map