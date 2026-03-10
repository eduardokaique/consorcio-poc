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
exports.GruposService = void 0;
const common_1 = require("@nestjs/common");
const grupos_repository_1 = require("./grupos.repository");
const categoria_enum_1 = require("./enums/categoria.enum");
let GruposService = class GruposService {
    constructor(gruposRepository) {
        this.gruposRepository = gruposRepository;
    }
    async criar(dto) {
        const limites = categoria_enum_1.LIMITES_POR_CATEGORIA[dto.categoria];
        if (dto.valorCredito < limites.min || dto.valorCredito > limites.max) {
            throw new common_1.BadRequestException(`Valor de crédito para ${dto.categoria} deve estar entre R$ ${limites.min.toLocaleString('pt-BR')} e R$ ${limites.max.toLocaleString('pt-BR')}`);
        }
        if (dto.prazoMeses > limites.prazoMax) {
            throw new common_1.BadRequestException(`Prazo máximo para ${dto.categoria} é de ${limites.prazoMax} meses`);
        }
        const codigo = this.gerarCodigoGrupo(dto.categoria);
        return this.gruposRepository.criar({ ...dto, codigo });
    }
    async buscarPorId(id) {
        const grupo = await this.gruposRepository.buscarPorId(id);
        if (!grupo)
            throw new common_1.NotFoundException(`Grupo ${id} não encontrado`);
        return grupo;
    }
    async listarDisponiveis(categoria) {
        return this.gruposRepository.listarComVagas(categoria);
    }
    async adicionarParticipante(grupoId) {
        const grupo = await this.buscarPorId(grupoId);
        if (grupo.participantesAtivos >= grupo.totalParticipantes) {
            throw new common_1.BadRequestException('Grupo sem vagas disponíveis');
        }
        if (grupo.status !== 'FORMANDO' && grupo.status !== 'ATIVO') {
            throw new common_1.BadRequestException('Grupo não está aceitando novos participantes');
        }
        return this.gruposRepository.incrementarParticipantes(grupoId);
    }
    calcularParcelaMensal(valorCredito, prazoMeses, taxaAdminPercentual) {
        const totalComTaxa = valorCredito * (1 + taxaAdminPercentual / 100);
        return Number((totalComTaxa / prazoMeses).toFixed(2));
    }
    gerarCodigoGrupo(categoria) {
        const prefixos = {
            imovel: 'IMO',
            veiculo_leve: 'VEL',
            veiculo_pesado: 'VEP',
            servico: 'SRV',
            moto: 'MTO',
        };
        const prefixo = prefixos[categoria] ?? 'GRP';
        const numero = Math.floor(Math.random() * 900000 + 100000);
        return `${prefixo}-${numero}`;
    }
};
exports.GruposService = GruposService;
exports.GruposService = GruposService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [grupos_repository_1.GruposRepository])
], GruposService);
//# sourceMappingURL=grupos.service.js.map