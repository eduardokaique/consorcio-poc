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
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const relatorios_service_1 = require("./relatorios.service");
const sucor_service_1 = require("./sucor.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
const config_1 = require("@nestjs/config");
let RelatoriosController = class RelatoriosController {
    constructor(relatoriosService, sucorService, config) {
        this.relatoriosService = relatoriosService;
        this.sucorService = sucorService;
        this.config = config;
    }
    resumo(inicio, fim) {
        return this.relatoriosService.resumoGeral(new Date(inicio ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)), new Date(fim ?? new Date()));
    }
    inadimplencia() {
        return this.relatoriosService.inadimplenciaPorGrupo();
    }
    contemplacoes(inicio, fim) {
        const hoje = new Date();
        return this.relatoriosService.contemplacoesPorPeriodo(new Date(inicio ?? new Date(hoje.getFullYear(), 0, 1)), new Date(fim ?? hoje));
    }
    fluxoCaixa(grupoId) {
        return this.relatoriosService.fluxoCaixaFundoComum(grupoId);
    }
    async sucor(competencia, res) {
        const comp = competencia ?? `${new Date().getFullYear()}${String(new Date().getMonth()).padStart(2, '0')}`;
        const buffer = await this.sucorService.gerarArquivo({
            cnpjAdministradora: this.config.get('CNPJ_ADMINISTRADORA', '00000000000000'),
            nomeAdministradora: 'CONSORCIOPRO ADMINISTRADORA',
            competencia: comp,
        });
        res.set({
            'Content-Type': 'text/plain; charset=latin1',
            'Content-Disposition': `attachment; filename="SUCOR_${comp}.TXT"`,
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Get)('resumo'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumo geral do período' }),
    __param(0, (0, common_1.Query)('inicio')),
    __param(1, (0, common_1.Query)('fim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "resumo", null);
__decorate([
    (0, common_1.Get)('inadimplencia'),
    (0, swagger_1.ApiOperation)({ summary: 'Inadimplência por grupo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "inadimplencia", null);
__decorate([
    (0, common_1.Get)('contemplacoes'),
    (0, swagger_1.ApiOperation)({ summary: 'Contemplações por período' }),
    __param(0, (0, common_1.Query)('inicio')),
    __param(1, (0, common_1.Query)('fim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "contemplacoes", null);
__decorate([
    (0, common_1.Get)('fluxo-caixa'),
    (0, swagger_1.ApiOperation)({ summary: 'Fluxo de caixa do fundo comum por grupo' }),
    __param(0, (0, common_1.Query)('grupoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "fluxoCaixa", null);
__decorate([
    (0, common_1.Get)('sucor'),
    (0, swagger_1.ApiOperation)({ summary: 'Download do arquivo SUCOR para o BACEN (TXT largura fixa)' }),
    __param(0, (0, common_1.Query)('competencia')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RelatoriosController.prototype, "sucor", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, swagger_1.ApiTags)('relatorios'),
    (0, common_1.Controller)('relatorios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'GESTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [relatorios_service_1.RelatoriosService,
        sucor_service_1.SucorService,
        config_1.ConfigService])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map