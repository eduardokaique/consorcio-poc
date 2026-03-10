"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const event_emitter_1 = require("@nestjs/event-emitter");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./config/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const grupos_module_1 = require("./modules/grupos/grupos.module");
const participantes_module_1 = require("./modules/participantes/participantes.module");
const assembleias_module_1 = require("./modules/assembleias/assembleias.module");
const financeiro_module_1 = require("./modules/financeiro/financeiro.module");
const contemplacao_module_1 = require("./modules/contemplacao/contemplacao.module");
const notificacoes_module_1 = require("./modules/notificacoes/notificacoes.module");
const relatorios_module_1 = require("./modules/relatorios/relatorios.module");
const health_module_1 = require("./modules/health/health.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 10 },
                { name: 'medium', ttl: 60000, limit: 100 },
            ]),
            event_emitter_1.EventEmitterModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            grupos_module_1.GruposModule,
            participantes_module_1.ParticipantesModule,
            assembleias_module_1.AssembleiasModule,
            financeiro_module_1.FinanceiroModule,
            contemplacao_module_1.ContemplacaoModule,
            notificacoes_module_1.NotificacoesModule,
            relatorios_module_1.RelatoriosModule,
            health_module_1.HealthModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map