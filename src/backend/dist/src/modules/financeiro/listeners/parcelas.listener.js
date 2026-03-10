"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ParcelasListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelasListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const financeiro_service_1 = require("../financeiro.service");
let ParcelasListener = ParcelasListener_1 = class ParcelasListener {
    constructor(financeiroService) {
        this.financeiroService = financeiroService;
        this.logger = new common_1.Logger(ParcelasListener_1.name);
    }
    async handleParticipanteCriado(payload) {
        this.logger.log(`Gerando parcelas para participante ${payload.participanteId}`);
        try {
            const quantidade = await this.financeiroService.gerarParcelas(payload.participanteId);
            this.logger.log(`${quantidade} parcelas criadas para ${payload.participanteId}`);
        }
        catch (err) {
            this.logger.error(`Erro ao gerar parcelas para ${payload.participanteId}`, err);
        }
    }
    async handleParcelaPaga(payload) {
        this.logger.log(`Parcela ${payload.parcelaId} paga — atualizando percentual`);
    }
};
exports.ParcelasListener = ParcelasListener;
__decorate([
    (0, event_emitter_1.OnEvent)('participante.criado', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParcelasListener.prototype, "handleParticipanteCriado", null);
__decorate([
    (0, event_emitter_1.OnEvent)('parcela.paga', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParcelasListener.prototype, "handleParcelaPaga", null);
exports.ParcelasListener = ParcelasListener = ParcelasListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financeiro_service_1.FinanceiroService])
], ParcelasListener);
//# sourceMappingURL=parcelas.listener.js.map