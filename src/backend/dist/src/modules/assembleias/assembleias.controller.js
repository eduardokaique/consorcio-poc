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
exports.AssembleiasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assembleias_service_1 = require("./assembleias.service");
const ofertar_lance_dto_1 = require("./dto/ofertar-lance.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
const usuario_atual_decorator_1 = require("../../common/decorators/usuario-atual.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let AssembleiasController = class AssembleiasController {
    constructor(assembleiasService) {
        this.assembleiasService = assembleiasService;
    }
    listarPorGrupo(grupoId) {
        return this.assembleiasService.listarPorGrupo(grupoId);
    }
    buscarPorId(id) {
        return this.assembleiasService.buscarPorId(id);
    }
    verificarSorteio(id, cota) {
        return this.assembleiasService.verificarSorteio(id, Number(cota));
    }
    ofertarLance(usuarioId, assembleiaId, dto) {
        return this.assembleiasService.ofertarLance(usuarioId, { ...dto, assembleiaId });
    }
    realizar(id) {
        return this.assembleiasService.realizar(id);
    }
};
exports.AssembleiasController = AssembleiasController;
__decorate([
    (0, common_1.Get)('grupo/:grupoId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar assembleias de um grupo' }),
    __param(0, (0, common_1.Param)('grupoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssembleiasController.prototype, "listarPorGrupo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes de uma assembleia' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssembleiasController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Get)(':id/verificar-sorteio'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar legitimidade do sorteio (auditoria pública)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('cota')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssembleiasController.prototype, "verificarSorteio", null);
__decorate([
    (0, common_1.Post)(':id/lances'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ofertar lance em uma assembleia' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)('sub')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ofertar_lance_dto_1.OfertarLanceDto]),
    __metadata("design:returntype", void 0)
], AssembleiasController.prototype, "ofertarLance", null);
__decorate([
    (0, common_1.Post)(':id/realizar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'GESTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Realizar assembleia manualmente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssembleiasController.prototype, "realizar", null);
exports.AssembleiasController = AssembleiasController = __decorate([
    (0, swagger_1.ApiTags)('assembleias'),
    (0, common_1.Controller)('assembleias'),
    __metadata("design:paramtypes", [assembleias_service_1.AssembleiasService])
], AssembleiasController);
//# sourceMappingURL=assembleias.controller.js.map