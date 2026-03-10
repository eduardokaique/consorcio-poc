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
exports.ParticipantesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const participantes_service_1 = require("./participantes.service");
const aderir_grupo_dto_1 = require("./dto/aderir-grupo.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const usuario_atual_decorator_1 = require("../../common/decorators/usuario-atual.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let ParticipantesController = class ParticipantesController {
    constructor(participantesService) {
        this.participantesService = participantesService;
    }
    listarMeus(usuarioId) {
        return this.participantesService.listarPorUsuario(usuarioId);
    }
    buscarPorId(id, usuarioId) {
        return this.participantesService.buscarPorId(id, usuarioId);
    }
    aderir(usuarioId, dto) {
        return this.participantesService.aderirAGrupo(usuarioId, dto);
    }
    iniciarKyc(usuarioId) {
        return this.participantesService.iniciarKyc(usuarioId);
    }
    webhookKyc(body) {
        return this.participantesService.processarWebhookKyc(body.sessionId, body.resultado);
    }
};
exports.ParticipantesController = ParticipantesController;
__decorate([
    (0, common_1.Get)('meus'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os grupos do usuário logado' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParticipantesController.prototype, "listarMeus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes de uma participação específica' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, usuario_atual_decorator_1.UsuarioAtual)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParticipantesController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Post)('aderir'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Aderir a um grupo de consórcio' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, aderir_grupo_dto_1.AderirGrupoDto]),
    __metadata("design:returntype", void 0)
], ParticipantesController.prototype, "aderir", null);
__decorate([
    (0, common_1.Post)('kyc/iniciar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar processo de verificação de identidade (KYC)' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParticipantesController.prototype, "iniciarKyc", null);
__decorate([
    (0, common_1.Post)('kyc/webhook'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook iDwall — resultado do KYC (não requer auth)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParticipantesController.prototype, "webhookKyc", null);
exports.ParticipantesController = ParticipantesController = __decorate([
    (0, swagger_1.ApiTags)('participantes'),
    (0, common_1.Controller)('participantes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [participantes_service_1.ParticipantesService])
], ParticipantesController);
//# sourceMappingURL=participantes.controller.js.map