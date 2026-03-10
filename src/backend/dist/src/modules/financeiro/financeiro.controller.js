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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const financeiro_service_1 = require("./financeiro.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let FinanceiroController = class FinanceiroController {
    constructor(financeiroService) {
        this.financeiroService = financeiroService;
    }
    extrato(participanteId, status, pagina) {
        return this.financeiroService.buscarExtrato(participanteId, status, Number(pagina) || 1);
    }
    gerarPix(parcelaId) {
        return this.financeiroService.gerarPix(parcelaId);
    }
    gerarBoleto(parcelaId) {
        return this.financeiroService.gerarBoleto(parcelaId);
    }
    webhookPix(payload, assinatura, req) {
        const rawBody = req.rawBody ?? JSON.stringify(payload);
        return this.financeiroService.processarWebhookPix(payload, assinatura, rawBody);
    }
    fundoComum(grupoId) {
        return this.financeiroService.calcularFundoComum(grupoId);
    }
    processarInadimplencias() {
        return this.financeiroService.processarInadimplencias();
    }
};
exports.FinanceiroController = FinanceiroController;
__decorate([
    (0, common_1.Get)('extrato/:participanteId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Extrato de parcelas do participante' }),
    __param(0, (0, common_1.Param)('participanteId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('pagina')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "extrato", null);
__decorate([
    (0, common_1.Post)('parcelas/:id/pix'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar cobrança Pix para uma parcela' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "gerarPix", null);
__decorate([
    (0, common_1.Post)('parcelas/:id/boleto'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar boleto para uma parcela' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "gerarBoleto", null);
__decorate([
    (0, common_1.Post)('webhooks/pix'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook Celcoin — confirmação de pagamento Pix' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-celcoin-signature')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "webhookPix", null);
__decorate([
    (0, common_1.Get)('grupos/:grupoId/fundo-comum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'GESTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Saldo do fundo comum do grupo' }),
    __param(0, (0, common_1.Param)('grupoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "fundoComum", null);
__decorate([
    (0, common_1.Post)('jobs/inadimplencias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Executar job de inadimplências manualmente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceiroController.prototype, "processarInadimplencias", null);
exports.FinanceiroController = FinanceiroController = __decorate([
    (0, swagger_1.ApiTags)('financeiro'),
    (0, common_1.Controller)('financeiro'),
    __metadata("design:paramtypes", [financeiro_service_1.FinanceiroService])
], FinanceiroController);
//# sourceMappingURL=financeiro.controller.js.map