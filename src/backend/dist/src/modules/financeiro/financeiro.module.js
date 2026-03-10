"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const financeiro_controller_1 = require("./financeiro.controller");
const financeiro_service_1 = require("./financeiro.service");
const celcoin_service_1 = require("./celcoin.service");
const parcela_calculator_service_1 = require("./parcela-calculator.service");
const parcelas_listener_1 = require("./listeners/parcelas.listener");
const prisma_module_1 = require("../../config/prisma.module");
let FinanceiroModule = class FinanceiroModule {
};
exports.FinanceiroModule = FinanceiroModule;
exports.FinanceiroModule = FinanceiroModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, axios_1.HttpModule],
        controllers: [financeiro_controller_1.FinanceiroController],
        providers: [
            financeiro_service_1.FinanceiroService,
            celcoin_service_1.CelcoinService,
            parcela_calculator_service_1.ParcelaCalculatorService,
            parcelas_listener_1.ParcelasListener,
        ],
        exports: [financeiro_service_1.FinanceiroService, parcela_calculator_service_1.ParcelaCalculatorService],
    })
], FinanceiroModule);
//# sourceMappingURL=financeiro.module.js.map