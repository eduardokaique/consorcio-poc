"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
        credentials: true,
    });
    app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('ConsorcioPro API')
            .setDescription('API do sistema de consórcio digital')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`ConsorcioPro API rodando em http://localhost:${port}/api`);
    if (process.env.NODE_ENV !== 'production') {
        logger.log(`Swagger em http://localhost:${port}/api/docs`);
    }
    const signals = ['SIGTERM', 'SIGINT'];
    for (const signal of signals) {
        process.on(signal, async () => {
            logger.log(`${signal} recebido — iniciando graceful shutdown...`);
            await app.close();
            logger.log('Aplicação encerrada com sucesso.');
            process.exit(0);
        });
    }
}
bootstrap();
//# sourceMappingURL=main.js.map