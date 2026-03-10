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
var ContemplacaoListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContemplacaoListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const contemplacao_service_1 = require("./contemplacao.service");
let ContemplacaoListener = ContemplacaoListener_1 = class ContemplacaoListener {
    constructor(contemplacaoService) {
        this.contemplacaoService = contemplacaoService;
        this.logger = new common_1.Logger(ContemplacaoListener_1.name);
    }
    async handleAssembleiaRealizada(payload) {
        this.logger.log(`Iniciando processo de contemplação para ${payload.participanteContempladoId}`);
        try {
            await this.contemplacaoService.iniciarProcesso(payload.participanteContempladoId);
        }
        catch (err) {
            this.logger.error('Erro ao iniciar processo de contemplação', err);
        }
    }
};
exports.ContemplacaoListener = ContemplacaoListener;
__decorate([
    (0, event_emitter_1.OnEvent)('assembleia.realizada', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContemplacaoListener.prototype, "handleAssembleiaRealizada", null);
exports.ContemplacaoListener = ContemplacaoListener = ContemplacaoListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contemplacao_service_1.ContemplacaoService])
], ContemplacaoListener);
//# sourceMappingURL=contemplacao.listener.js.map