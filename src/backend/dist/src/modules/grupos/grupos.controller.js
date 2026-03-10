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
exports.GruposController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const grupos_service_1 = require("./grupos.service");
const criar_grupo_dto_1 = require("./dto/criar-grupo.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
let GruposController = class GruposController {
    constructor(gruposService) {
        this.gruposService = gruposService;
    }
    listarDisponiveis(categoria) {
        return this.gruposService.listarDisponiveis(categoria);
    }
    buscarPorId(id) {
        return this.gruposService.buscarPorId(id);
    }
    criar(dto) {
        return this.gruposService.criar(dto);
    }
    calcularParcela(valorCredito, prazoMeses, taxaAdmin) {
        const parcela = this.gruposService.calcularParcelaMensal(Number(valorCredito), Number(prazoMeses), Number(taxaAdmin));
        const totalPago = Number((parcela * Number(prazoMeses)).toFixed(2));
        const economia = this.calcularEconomiaVsFinanciamento(Number(valorCredito), Number(prazoMeses), totalPago);
        return { parcelaMensal: parcela, totalPago, economiaVsFinanciamento: economia };
    }
    calcularEconomiaVsFinanciamento(valorCredito, prazoMeses, totalConsorcio) {
        const taxaMensal = 0.00839;
        const parcelaFinanciamento = (valorCredito * taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) /
            (Math.pow(1 + taxaMensal, prazoMeses) - 1);
        const totalFinanciamento = parcelaFinanciamento * prazoMeses;
        return Number((totalFinanciamento - totalConsorcio).toFixed(2));
    }
};
exports.GruposController = GruposController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar grupos disponíveis com vagas' }),
    __param(0, (0, common_1.Query)('categoria')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GruposController.prototype, "listarDisponiveis", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar grupo por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GruposController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'GESTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo grupo de consórcio' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_grupo_dto_1.CriarGrupoDto]),
    __metadata("design:returntype", void 0)
], GruposController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('simulador/calcular'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular parcela mensal (simulador)' }),
    __param(0, (0, common_1.Query)('valorCredito')),
    __param(1, (0, common_1.Query)('prazoMeses')),
    __param(2, (0, common_1.Query)('taxaAdmin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GruposController.prototype, "calcularParcela", null);
exports.GruposController = GruposController = __decorate([
    (0, swagger_1.ApiTags)('grupos'),
    (0, common_1.Controller)('grupos'),
    __metadata("design:paramtypes", [grupos_service_1.GruposService])
], GruposController);
//# sourceMappingURL=grupos.controller.js.map