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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarGrupoDto = void 0;
const class_validator_1 = require("class-validator");
const categoria_enum_1 = require("../enums/categoria.enum");
class CriarGrupoDto {
}
exports.CriarGrupoDto = CriarGrupoDto;
__decorate([
    (0, class_validator_1.IsEnum)(categoria_enum_1.CategoriaConsorcio),
    __metadata("design:type", String)
], CriarGrupoDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(5000),
    (0, class_validator_1.Max)(1500000),
    __metadata("design:type", Number)
], CriarGrupoDto.prototype, "valorCredito", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(12),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Number)
], CriarGrupoDto.prototype, "prazoMeses", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], CriarGrupoDto.prototype, "totalParticipantes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(22),
    __metadata("design:type", Number)
], CriarGrupoDto.prototype, "taxaAdminPercentual", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CriarGrupoDto.prototype, "fundoReservaPercentual", void 0);
//# sourceMappingURL=criar-grupo.dto.js.map