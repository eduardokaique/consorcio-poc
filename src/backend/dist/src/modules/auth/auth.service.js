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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma_service_1 = require("../../config/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async registro(dto) {
        const emailExiste = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });
        if (emailExiste)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const celularExiste = await this.prisma.usuario.findUnique({
            where: { celular: dto.celular },
        });
        if (celularExiste)
            throw new common_1.ConflictException('Celular já cadastrado');
        const cpfHash = this.hashCpf(dto.cpf);
        const cpfExiste = await this.prisma.usuario.findUnique({ where: { cpfHash } });
        if (cpfExiste)
            throw new common_1.ConflictException('CPF já cadastrado');
        const senha = await bcrypt.hash(dto.senha, 12);
        const usuario = await this.prisma.usuario.create({
            data: {
                nome: dto.nome,
                email: dto.email.toLowerCase(),
                celular: dto.celular,
                cpfHash,
                senha,
                role: 'CONSORCIADO',
                status: 'PENDENTE_KYC',
            },
        });
        return this.gerarTokens(usuario.id, usuario.email, usuario.role);
    }
    async login(dto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!usuario || !usuario.senha) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (usuario.status === 'BLOQUEADO') {
            throw new common_1.UnauthorizedException('Conta bloqueada. Entre em contato com o suporte.');
        }
        const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
        if (!senhaValida) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        return this.gerarTokens(usuario.id, usuario.email, usuario.role);
    }
    async refresh(refreshToken) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { refreshToken },
            include: { usuario: true },
        });
        if (!sessao || sessao.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
        }
        await this.prisma.sessao.delete({ where: { id: sessao.id } });
        return this.gerarTokens(sessao.usuario.id, sessao.usuario.email, sessao.usuario.role);
    }
    async logout(usuarioId, refreshToken) {
        await this.prisma.sessao.deleteMany({
            where: { usuarioId, refreshToken },
        });
    }
    async validarUsuario(email, senha) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!usuario || !usuario.senha)
            return null;
        const valido = await bcrypt.compare(senha, usuario.senha);
        if (!valido)
            return null;
        const { senha: _senha, ...result } = usuario;
        return result;
    }
    async gerarTokens(usuarioId, email, role) {
        const payload = { sub: usuarioId, email, role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomUUID();
        const refreshExpiresIn = 7 * 24 * 60 * 60 * 1000;
        await this.prisma.sessao.create({
            data: {
                usuarioId,
                refreshToken,
                expiresAt: new Date(Date.now() + refreshExpiresIn),
            },
        });
        return { accessToken, refreshToken, expiresIn: 900 };
    }
    hashCpf(cpf) {
        const cpfNormalizado = cpf.replace(/\D/g, '');
        return crypto.createHash('sha256').update(cpfNormalizado).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map