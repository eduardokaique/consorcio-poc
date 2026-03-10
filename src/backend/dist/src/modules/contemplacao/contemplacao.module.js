"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContemplacaoModule = void 0;
const common_1 = require("@nestjs/common");
const contemplacao_controller_1 = require("./contemplacao.controller");
const contemplacao_service_1 = require("./contemplacao.service");
const contemplacao_listener_1 = require("./contemplacao.listener");
const prisma_module_1 = require("../../config/prisma.module");
let ContemplacaoModule = class ContemplacaoModule {
};
exports.ContemplacaoModule = ContemplacaoModule;
exports.ContemplacaoModule = ContemplacaoModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [contemplacao_controller_1.ContemplacaoController],
        providers: [contemplacao_service_1.ContemplacaoService, contemplacao_listener_1.ContemplacaoListener],
        exports: [contemplacao_service_1.ContemplacaoService],
    })
], ContemplacaoModule);
//# sourceMappingURL=contemplacao.module.js.map