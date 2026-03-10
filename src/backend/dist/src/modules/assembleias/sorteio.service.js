"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorteioService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let SorteioService = class SorteioService {
    gerarCommitment() {
        const seed = (0, crypto_1.randomBytes)(32).toString('hex');
        const commitment = (0, crypto_1.createHash)('sha256').update(seed).digest('hex');
        return { seed, commitment };
    }
    verificarCommitment(seed, commitment) {
        const hash = (0, crypto_1.createHash)('sha256').update(seed).digest('hex');
        return hash === commitment;
    }
    realizarSorteio(seed, cotasAtivas, numeroAssembleia) {
        const input = `${seed}:${cotasAtivas.sort().join(',')}:${numeroAssembleia}`;
        const hashInput = (0, crypto_1.createHash)('sha256').update(input).digest('hex');
        const cotas = [...cotasAtivas];
        this.fisherYatesShuffle(cotas, hashInput);
        const commitment = (0, crypto_1.createHash)('sha256').update(seed).digest('hex');
        return {
            cotaContemplacada: cotas[0],
            seed,
            commitment,
            timestamp: new Date().toISOString(),
            ordenacaoCompleta: cotas,
        };
    }
    verificarResultado(seed, cotasAtivas, numeroAssembleia, cotaEsperada) {
        const resultado = this.realizarSorteio(seed, cotasAtivas, numeroAssembleia);
        return resultado.cotaContemplacada === cotaEsperada;
    }
    fisherYatesShuffle(array, hashSeed) {
        let hashIndex = 0;
        const getNextByte = () => {
            if (hashIndex >= hashSeed.length - 1) {
                hashSeed = (0, crypto_1.createHash)('sha256').update(hashSeed).digest('hex');
                hashIndex = 0;
            }
            const byte = parseInt(hashSeed.slice(hashIndex, hashIndex + 2), 16);
            hashIndex += 2;
            return byte;
        };
        for (let i = array.length - 1; i > 0; i--) {
            const randomValue = (getNextByte() * 256 + getNextByte()) % (i + 1);
            [array[i], array[randomValue]] = [array[randomValue], array[i]];
        }
    }
};
exports.SorteioService = SorteioService;
exports.SorteioService = SorteioService = __decorate([
    (0, common_1.Injectable)()
], SorteioService);
//# sourceMappingURL=sorteio.service.js.map