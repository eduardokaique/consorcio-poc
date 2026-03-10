"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantesModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const participantes_controller_1 = require("./participantes.controller");
const participantes_service_1 = require("./participantes.service");
const kyc_service_1 = require("./kyc.service");
const grupos_module_1 = require("../grupos/grupos.module");
const prisma_module_1 = require("../../config/prisma.module");
let ParticipantesModule = class ParticipantesModule {
};
exports.ParticipantesModule = ParticipantesModule;
exports.ParticipantesModule = ParticipantesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, axios_1.HttpModule, grupos_module_1.GruposModule],
        controllers: [participantes_controller_1.ParticipantesController],
        providers: [participantes_service_1.ParticipantesService, kyc_service_1.KycService],
        exports: [participantes_service_1.ParticipantesService],
    })
], ParticipantesModule);
//# sourceMappingURL=participantes.module.js.map