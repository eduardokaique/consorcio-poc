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
exports.ParticipantesService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../config/prisma.service");
const grupos_service_1 = require("../grupos/grupos.service");
const kyc_service_1 = require("./kyc.service");
let ParticipantesService = class ParticipantesService {
    constructor(prisma, gruposService, kycService, eventEmitter) {
        this.prisma = prisma;
        this.gruposService = gruposService;
        this.kycService = kycService;
        this.eventEmitter = eventEmitter;
    }
    async aderirAGrupo(usuarioId, dto) {
        const grupo = await this.gruposService.adicionarParticipante(dto.grupoId);
        const jaParticipa = await this.prisma.participante.findFirst({
            where: { grupoId: dto.grupoId, usuarioId },
        });
        if (jaParticipa) {
            throw new common_1.ConflictException('Você já é participante neste grupo');
        }
        const usuario = await this.prisma.usuario.findUniqueOrThrow({
            where: { id: usuarioId },
        });
        if (usuario.status === 'PENDENTE_KYC') {
            throw new common_1.BadRequestException('É necessário completar a verificação de identidade antes de contratar');
        }
        const numeroCota = await this.proximaCotaDisponivel(dto.grupoId);
        const participante = await this.prisma.participante.create({
            data: {
                grupoId: dto.grupoId,
                usuarioId,
                numeroCota,
                valorCredito: grupo.valorCredito,
                status: 'ATIVO',
            },
            include: { grupo: true, usuario: { select: { nome: true, email: true } } },
        });
        this.eventEmitter.emit('participante.criado', {
            participanteId: participante.id,
            usuarioId,
            grupoId: dto.grupoId,
            numeroCota,
            valorCredito: grupo.valorCredito,
        });
        return participante;
    }
    async buscarPorId(id, usuarioId) {
        const participante = await this.prisma.participante.findFirst({
            where: { id, usuarioId },
            include: {
                grupo: true,
                parcelas: {
                    orderBy: { numero: 'desc' },
                    take: 3,
                },
            },
        });
        if (!participante)
            throw new common_1.NotFoundException('Participante não encontrado');
        return participante;
    }
    async listarPorUsuario(usuarioId) {
        return this.prisma.participante.findMany({
            where: { usuarioId },
            include: {
                grupo: { select: { codigo: true, categoria: true, prazoMeses: true } },
                parcelas: {
                    where: { status: 'PENDENTE' },
                    orderBy: { dataVencimento: 'asc' },
                    take: 1,
                },
            },
            orderBy: { criadoEm: 'desc' },
        });
    }
    async iniciarKyc(usuarioId) {
        const usuario = await this.prisma.usuario.findUniqueOrThrow({
            where: { id: usuarioId },
        });
        if (usuario.status === 'ATIVO') {
            throw new common_1.BadRequestException('KYC já foi concluído');
        }
        return this.kycService.iniciarKyc(usuarioId, usuario.nome);
    }
    async processarWebhookKyc(sessionId, resultado) {
        const kyc = await this.kycService.processarResultadoKyc(sessionId, resultado);
        if (kyc.status === 'APROVADO') {
            const usuarioId = sessionId.replace('dev-session-', '');
            await this.prisma.usuario.update({
                where: { id: usuarioId },
                data: { status: 'ATIVO' },
            });
            this.eventEmitter.emit('kyc.aprovado', { usuarioId });
        }
        return kyc;
    }
    async proximaCotaDisponivel(grupoId) {
        const ultimo = await this.prisma.participante.findFirst({
            where: { grupoId },
            orderBy: { numeroCota: 'desc' },
        });
        return (ultimo?.numeroCota ?? 0) + 1;
    }
};
exports.ParticipantesService = ParticipantesService;
exports.ParticipantesService = ParticipantesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        grupos_service_1.GruposService,
        kyc_service_1.KycService,
        event_emitter_1.EventEmitter2])
], ParticipantesService);
//# sourceMappingURL=participantes.service.js.map