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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const swagger_1 = require("@nestjs/swagger");
const prisma_health_1 = require("./prisma.health");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let HealthController = class HealthController {
    constructor(health, prisma, memory, disk) {
        this.health = health;
        this.prisma = prisma;
        this.memory = memory;
        this.disk = disk;
    }
    liveness() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
    readiness() {
        return this.health.check([
            () => this.prisma.isHealthy('database'),
            () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
        ]);
    }
    check() {
        return this.health.check([
            () => this.prisma.isHealthy('database'),
            () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
            () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe — o processo está vivo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe — pronto para receber requisições' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check completo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        prisma_health_1.PrismaHealthIndicator,
        terminus_1.MemoryHealthIndicator,
        terminus_1.DiskHealthIndicator])
], HealthController);
//# sourceMappingURL=health.controller.js.map