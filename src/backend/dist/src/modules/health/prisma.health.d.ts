import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../../config/prisma.service';
export declare class PrismaHealthIndicator extends HealthIndicator {
    private readonly prisma;
    constructor(prisma: PrismaService);
    isHealthy(key: string): Promise<HealthIndicatorResult>;
}
