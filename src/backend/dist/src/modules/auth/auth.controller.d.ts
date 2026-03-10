import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registro(dto: RegistroDto): Promise<import("./auth.service").TokenPair>;
    login(dto: LoginDto): Promise<import("./auth.service").TokenPair>;
    refresh(dto: RefreshDto): Promise<import("./auth.service").TokenPair>;
    logout(usuario: any, dto: RefreshDto): Promise<void>;
    me(usuario: any): any;
}
