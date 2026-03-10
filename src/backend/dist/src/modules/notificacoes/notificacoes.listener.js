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
var NotificacoesListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacoesListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notificacoes_service_1 = require("./notificacoes.service");
let NotificacoesListener = NotificacoesListener_1 = class NotificacoesListener {
    constructor(notificacoes) {
        this.notificacoes = notificacoes;
        this.logger = new common_1.Logger(NotificacoesListener_1.name);
    }
    async onContemplacao(payload) {
        try {
            await this.notificacoes.notificarContemplacao({
                email: payload.usuarioEmail,
                celular: payload.celular ?? '',
                nome: payload.usuarioNome,
                valor: Number(payload.valor),
                grupoCode: payload.grupoCode ?? '',
            });
        }
        catch (err) {
            this.logger.error('Falha ao notificar contemplação', err);
        }
    }
    async onParcelaPaga(payload) {
        if (!payload.usuarioEmail)
            return;
        try {
            await this.notificacoes.notificarParcelaPaga({
                email: payload.usuarioEmail,
                nome: payload.usuarioNome ?? '',
                numero: payload.numeroParcela ?? 0,
                valor: payload.valorParcela ?? 0,
            });
        }
        catch (err) {
            this.logger.error('Falha ao notificar parcela paga', err);
        }
    }
    async onAssembleiaAgendada(payload) {
        this.logger.log(`Notificando assembleia agendada para grupo ${payload.grupoId}`);
    }
};
exports.NotificacoesListener = NotificacoesListener;
__decorate([
    (0, event_emitter_1.OnEvent)('contemplacao.iniciada', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacoesListener.prototype, "onContemplacao", null);
__decorate([
    (0, event_emitter_1.OnEvent)('parcela.paga', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacoesListener.prototype, "onParcelaPaga", null);
__decorate([
    (0, event_emitter_1.OnEvent)('assembleia.agendada', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacoesListener.prototype, "onAssembleiaAgendada", null);
exports.NotificacoesListener = NotificacoesListener = NotificacoesListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notificacoes_service_1.NotificacoesService])
], NotificacoesListener);
//# sourceMappingURL=notificacoes.listener.js.map