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
var CelcoinService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelcoinService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let CelcoinService = CelcoinService_1 = class CelcoinService {
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.logger = new common_1.Logger(CelcoinService_1.name);
        this.accessToken = null;
        this.tokenExpira = null;
    }
    async gerarCobrancaPix(txid, valor, descricao, expiracaoSegundos = 86400) {
        if (this.isDev())
            return this.mockPix(txid, valor);
        const token = await this.obterToken();
        const url = `${this.config.getOrThrow('CELCOIN_API_URL')}/pix/v1/cobv/${txid}`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.put(url, {
                calendario: { expiracao: expiracaoSegundos },
                valor: { original: valor.toFixed(2) },
                chave: this.config.getOrThrow('PIX_CHAVE'),
                infoAdicionais: [{ nome: 'Descricao', valor: descricao }],
            }, { headers: { Authorization: `Bearer ${token}` } }));
            return {
                txid,
                qrCode: data.pixCopiaECola,
                copiaCola: data.pixCopiaECola,
                valor,
                expiracao: new Date(Date.now() + expiracaoSegundos * 1000).toISOString(),
            };
        }
        catch (err) {
            this.logger.error('Erro ao gerar cobrança Pix', err);
            throw new common_1.ServiceUnavailableException('Não foi possível gerar a cobrança Pix');
        }
    }
    async gerarBoleto(nossoNumero, valor, dataVencimento, pagador) {
        if (this.isDev())
            return this.mockBoleto(nossoNumero, valor, dataVencimento);
        const token = await this.obterToken();
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.config.getOrThrow('CELCOIN_API_URL')}/bankslip/v1`, {
                externalId: nossoNumero,
                expirationDate: dataVencimento.toISOString().split('T')[0],
                amount: valor,
                payer: { name: pagador.nome, document: pagador.cpf },
            }, { headers: { Authorization: `Bearer ${token}` } }));
            return {
                nossoNumero,
                linhaDigitavel: data.digitableLine,
                codigoBarras: data.barCode,
                valor,
                vencimento: dataVencimento.toISOString().split('T')[0],
                url: data.bankSlipUrl,
            };
        }
        catch (err) {
            this.logger.error('Erro ao gerar boleto', err);
            throw new common_1.ServiceUnavailableException('Não foi possível gerar o boleto');
        }
    }
    async consultarStatusPix(txid) {
        if (this.isDev())
            return { txid, status: 'ATIVA' };
        const token = await this.obterToken();
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.get(`${this.config.getOrThrow('CELCOIN_API_URL')}/pix/v1/cobv/${txid}`, { headers: { Authorization: `Bearer ${token}` } }));
        return { txid, status: data.status, valor: data.valor?.original, horarioPagamento: data.pix?.[0]?.horario };
    }
    validarAssinaturaWebhook(payload, assinaturaRecebida) {
        const crypto = require('crypto');
        const secret = this.config.getOrThrow('CELCOIN_WEBHOOK_SECRET');
        const assinaturaEsperada = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        return crypto.timingSafeEqual(Buffer.from(assinaturaEsperada, 'hex'), Buffer.from(assinaturaRecebida, 'hex'));
    }
    async obterToken() {
        if (this.accessToken && this.tokenExpira && new Date() < this.tokenExpira) {
            return this.accessToken;
        }
        const credentials = Buffer.from(`${this.config.getOrThrow('CELCOIN_CLIENT_ID')}:${this.config.getOrThrow('CELCOIN_CLIENT_SECRET')}`).toString('base64');
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.config.getOrThrow('CELCOIN_API_URL')}/auth/v1/token`, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }));
        this.accessToken = data.access_token;
        this.tokenExpira = new Date(Date.now() + (data.expires_in - 60) * 1000);
        return this.accessToken;
    }
    isDev() {
        return this.config.get('NODE_ENV') === 'development' || this.config.get('NODE_ENV') === 'test';
    }
    mockPix(txid, valor) {
        return {
            txid,
            qrCode: `00020126580014BR.GOV.BCB.PIX0136mock-${txid}5204000053039865406${valor.toFixed(2)}5802BR5913ConsorcioPro6009SAO PAULO62140510${txid}6304MOCK`,
            copiaCola: `PIX_COPIA_COLA_${txid}`,
            valor,
            expiracao: new Date(Date.now() + 86400000).toISOString(),
        };
    }
    mockBoleto(nossoNumero, valor, vencimento) {
        return {
            nossoNumero,
            linhaDigitavel: `10490.00009 00001.234567 00000.000000 1 ${vencimento.getFullYear()}0000${Math.round(valor * 100)}`,
            codigoBarras: `1049000000000012345670000000000001${vencimento.getFullYear()}0000${Math.round(valor * 100)}`,
            valor,
            vencimento: vencimento.toISOString().split('T')[0],
            url: `http://localhost:3000/boleto-mock/${nossoNumero}`,
        };
    }
};
exports.CelcoinService = CelcoinService;
exports.CelcoinService = CelcoinService = CelcoinService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], CelcoinService);
//# sourceMappingURL=celcoin.service.js.map