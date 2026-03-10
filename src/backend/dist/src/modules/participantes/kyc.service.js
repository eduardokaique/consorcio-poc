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
var KycService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = exports.StatusKyc = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
var StatusKyc;
(function (StatusKyc) {
    StatusKyc["APROVADO"] = "APROVADO";
    StatusKyc["REPROVADO"] = "REPROVADO";
    StatusKyc["PENDENTE"] = "PENDENTE";
    StatusKyc["EM_ANALISE"] = "EM_ANALISE";
})(StatusKyc || (exports.StatusKyc = StatusKyc = {}));
let KycService = KycService_1 = class KycService {
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.logger = new common_1.Logger(KycService_1.name);
    }
    async validarCpf(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (!this.validarDigitosVerificadoresCpf(cpfLimpo)) {
            return { valido: false, situacao: 'INVALIDO' };
        }
        if (this.config.get('NODE_ENV') === 'development') {
            return { valido: true, situacao: 'REGULAR' };
        }
        try {
            const token = await this.obterTokenSerpro();
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.get(`${this.config.getOrThrow('SERPRO_API_URL')}/consulta-cpf/v1/cpf/${cpfLimpo}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }));
            return {
                valido: data.situacao?.codigo === '0',
                situacao: this.mapSituacaoCpf(data.situacao?.codigo),
                nome: data.nome,
                dataNascimento: data.nascimento,
            };
        }
        catch (error) {
            this.logger.error('Erro na validação CPF Serpro', error);
            return { valido: true, situacao: 'REGULAR' };
        }
    }
    async iniciarKyc(usuarioId, nome) {
        if (this.config.get('NODE_ENV') === 'development') {
            return {
                url: `http://localhost:3000/kyc-mock?session=dev-${usuarioId}`,
                sessionId: `dev-session-${usuarioId}`,
            };
        }
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.config.getOrThrow('IDWALL_API_URL')}/sdk-backend/v3/session`, {
                referenceId: usuarioId,
                config: {
                    documentTypes: ['RG', 'CNH'],
                    faceMatch: true,
                    liveness: true,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.config.getOrThrow('IDWALL_API_KEY')}`,
                    'Content-Type': 'application/json',
                },
            }));
            return { url: data.url, sessionId: data.sessionId };
        }
        catch (error) {
            this.logger.error('Erro ao iniciar KYC iDwall', error);
            throw new common_1.BadRequestException('Não foi possível iniciar a verificação de identidade');
        }
    }
    async processarResultadoKyc(sessionId, resultado) {
        const aprovado = resultado.status === 'APPROVED' && resultado.fraudScore < 0.5;
        return {
            status: aprovado ? StatusKyc.APROVADO : StatusKyc.REPROVADO,
            protocolo: sessionId,
            mensagem: aprovado ? undefined : 'Identidade não verificada. Tente novamente.',
        };
    }
    validarDigitosVerificadoresCpf(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
            return false;
        const calcDigito = (cpf, peso) => {
            let soma = 0;
            for (let i = 0; i < peso - 1; i++)
                soma += parseInt(cpf[i]) * (peso - i);
            const resto = (soma * 10) % 11;
            return resto === 10 || resto === 11 ? 0 : resto;
        };
        return (calcDigito(cpf, 10) === parseInt(cpf[9]) &&
            calcDigito(cpf, 11) === parseInt(cpf[10]));
    }
    mapSituacaoCpf(codigo) {
        const mapa = {
            '0': 'REGULAR',
            '2': 'SUSPENSA',
            '3': 'CANCELADA',
            '4': 'CANCELADA',
        };
        return mapa[codigo] ?? 'INVALIDO';
    }
    async obterTokenSerpro() {
        const credentials = Buffer.from(`${this.config.getOrThrow('SERPRO_CONSUMER_KEY')}:${this.config.getOrThrow('SERPRO_CONSUMER_SECRET')}`).toString('base64');
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.config.getOrThrow('SERPRO_API_URL')}/token`, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }));
        return data.access_token;
    }
};
exports.KycService = KycService;
exports.KycService = KycService = KycService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], KycService);
//# sourceMappingURL=kyc.service.js.map