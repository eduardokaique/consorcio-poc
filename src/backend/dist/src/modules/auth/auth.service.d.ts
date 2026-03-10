import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    registro(dto: RegistroDto): Promise<TokenPair>;
    login(dto: LoginDto): Promise<TokenPair>;
    refresh(refreshToken: string): Promise<TokenPair>;
    logout(usuarioId: string, refreshToken: string): Promise<void>;
    validarUsuario(email: string, senha: string): Promise<{
        id: string;
        email: string;
        celular: string;
        cpfHash: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUsuario;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    private gerarTokens;
    private hashCpf;
}
