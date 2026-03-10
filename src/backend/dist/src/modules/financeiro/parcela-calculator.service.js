"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelaCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let ParcelaCalculatorService = class ParcelaCalculatorService {
    calcularParcela(config) {
        const valorFundoComum = this.arredondar(config.valorCredito / config.prazoMeses);
        const taxaAdminMensal = config.taxaAdminPercentual / 100 / config.prazoMeses;
        const valorTaxaAdmin = this.arredondar(config.valorCredito * taxaAdminMensal);
        const fundoReservaMensal = config.fundoReservaPercentual / 100;
        const valorFundoReserva = this.arredondar(config.valorCredito * fundoReservaMensal);
        const valorSeguro = config.incluiSeguro
            ? this.arredondar(config.valorCredito * ((config.taxaSeguroMensal ?? 0.03) / 100))
            : 0;
        const valorTotal = this.arredondar(valorFundoComum + valorTaxaAdmin + valorFundoReserva + valorSeguro);
        return {
            valorPrincipal: valorFundoComum,
            valorFundoComum,
            valorFundoReserva,
            valorTaxaAdmin,
            valorSeguro,
            valorTotal,
        };
    }
    calcularReajuste(valorAtual, indicePercentual) {
        const fator = 1 + indicePercentual / 100;
        const novoValor = this.arredondar(valorAtual * fator);
        return {
            novoValor,
            valorReajuste: this.arredondar(novoValor - valorAtual),
        };
    }
    calcularEncargosInadimplencia(valorParcela, diasAtraso) {
        const multa = this.arredondar(valorParcela * 0.02);
        const jurosDiario = valorParcela * 0.01 / 30;
        const juros = this.arredondar(jurosDiario * diasAtraso);
        return {
            multa,
            juros,
            total: this.arredondar(valorParcela + multa + juros),
        };
    }
    arredondar(valor) {
        return Number(valor.toFixed(2));
    }
};
exports.ParcelaCalculatorService = ParcelaCalculatorService;
exports.ParcelaCalculatorService = ParcelaCalculatorService = __decorate([
    (0, common_1.Injectable)()
], ParcelaCalculatorService);
//# sourceMappingURL=parcela-calculator.service.js.map