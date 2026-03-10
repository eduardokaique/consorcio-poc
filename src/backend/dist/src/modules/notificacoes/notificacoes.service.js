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
var NotificacoesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacoesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_ses_1 = require("@aws-sdk/client-ses");
const client_sns_1 = require("@aws-sdk/client-sns");
let NotificacoesService = NotificacoesService_1 = class NotificacoesService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(NotificacoesService_1.name);
        const region = config.get('AWS_REGION', 'us-east-1');
        this.ses = new client_ses_1.SESClient({ region });
        this.sns = new client_sns_1.SNSClient({ region });
        this.fromEmail = config.get('AWS_SES_FROM_EMAIL', 'noreply@consorciopro.com.br');
    }
    async enviarEmail(payload) {
        if (this.isDev()) {
            this.logger.debug(`[DEV] Email para ${payload.para}: ${payload.assunto}`);
            return;
        }
        const params = {
            Source: `ConsorcioPro <${this.fromEmail}>`,
            Destination: { ToAddresses: [payload.para] },
            Message: {
                Subject: { Data: payload.assunto, Charset: 'UTF-8' },
                Body: {
                    Html: { Data: payload.htmlBody, Charset: 'UTF-8' },
                    ...(payload.textBody ? { Text: { Data: payload.textBody, Charset: 'UTF-8' } } : {}),
                },
            },
        };
        try {
            await this.ses.send(new client_ses_1.SendEmailCommand(params));
        }
        catch (err) {
            this.logger.error(`Falha ao enviar email para ${payload.para}`, err);
        }
    }
    async enviarSms(payload) {
        if (this.isDev()) {
            this.logger.debug(`[DEV] SMS para ${payload.celular}: ${payload.mensagem}`);
            return;
        }
        try {
            await this.sns.send(new client_sns_1.PublishCommand({
                PhoneNumber: `+55${payload.celular.replace(/\D/g, '')}`,
                Message: payload.mensagem,
                MessageAttributes: {
                    'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Transactional' },
                    'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'ConsorPro' },
                },
            }));
        }
        catch (err) {
            this.logger.error(`Falha ao enviar SMS para ${payload.celular}`, err);
        }
    }
    async notificarContemplacao(params) {
        const valorFormatado = params.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        await Promise.all([
            this.enviarEmail({
                para: params.email,
                assunto: `🎉 Parabéns! Você foi contemplado no grupo ${params.grupoCode}`,
                htmlBody: `
          <h2>Olá, ${params.nome}!</h2>
          <p>Temos uma ótima notícia: você foi <strong>contemplado</strong> no grupo <strong>${params.grupoCode}</strong>!</p>
          <p>Sua carta de crédito no valor de <strong>${valorFormatado}</strong> está em análise.</p>
          <p>Acesse o app para acompanhar o processo.</p>
          <a href="https://app.consorciopro.com.br/dashboard" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Acessar minha conta
          </a>
          <hr/>
          <p style="color:#666;font-size:12px;">ConsorcioPro — Seu consórcio sem burocracia</p>
        `,
            }),
            this.enviarSms({
                celular: params.celular,
                mensagem: `ConsorcioPro: Parabéns, ${params.nome.split(' ')[0]}! Você foi contemplado no grupo ${params.grupoCode} com carta de ${valorFormatado}. Acesse o app.`,
            }),
        ]);
    }
    async notificarParcelaPaga(params) {
        await this.enviarEmail({
            para: params.email,
            assunto: `Parcela ${params.numero} confirmada — ConsorcioPro`,
            htmlBody: `
        <p>Olá, ${params.nome}!</p>
        <p>Sua parcela <strong>#${params.numero}</strong> de
        <strong>${params.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        foi confirmada.</p>
        <p><a href="https://app.consorciopro.com.br/dashboard">Ver extrato</a></p>
      `,
        });
    }
    async notificarParcelaVencendo(params) {
        const valorFormatado = params.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        await Promise.all([
            this.enviarEmail({
                para: params.email,
                assunto: `Lembrete: parcela ${params.numero} vence em 3 dias`,
                htmlBody: `
          <p>Olá, ${params.nome}!</p>
          <p>Sua parcela <strong>#${params.numero}</strong> de <strong>${valorFormatado}</strong>
          vence em <strong>${params.dataVencimento}</strong>.</p>
          <a href="https://app.consorciopro.com.br/dashboard" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Pagar agora
          </a>
        `,
            }),
            this.enviarSms({
                celular: params.celular,
                mensagem: `ConsorcioPro: Parcela #${params.numero} (${valorFormatado}) vence em ${params.dataVencimento}. Acesse o app para pagar.`,
            }),
        ]);
    }
    async notificarAssembleiaAgendada(params) {
        await this.enviarEmail({
            para: params.email,
            assunto: `Assembleia do grupo ${params.grupoCode} em ${params.dataAssembleia}`,
            htmlBody: `
        <p>Olá, ${params.nome}!</p>
        <p>A assembleia do grupo <strong>${params.grupoCode}</strong> está agendada para
        <strong>${params.dataAssembleia}</strong>.</p>
        <p>Você tem até 1h antes para ofertar lances.</p>
        <p><strong>Commitment do sorteio (SHA-256):</strong><br/>
        <code style="font-size:11px;color:#555">${params.commitment}</code></p>
        <p style="font-size:12px;color:#666">
          O commitment garante que o sorteio não pode ser manipulado.
          Após a assembleia você pode verificar o resultado usando o seed revelado.
        </p>
        <a href="https://app.consorciopro.com.br/dashboard">Acessar assembleia</a>
      `,
        });
    }
    isDev() {
        return (this.config.get('NODE_ENV') === 'development' ||
            this.config.get('NODE_ENV') === 'test');
    }
};
exports.NotificacoesService = NotificacoesService;
exports.NotificacoesService = NotificacoesService = NotificacoesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificacoesService);
//# sourceMappingURL=notificacoes.service.js.map