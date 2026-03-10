interface ResultadoSorteio {
    cotaContemplacada: number;
    seed: string;
    commitment: string;
    timestamp: string;
    ordenacaoCompleta: number[];
}
export declare class SorteioService {
    gerarCommitment(): {
        seed: string;
        commitment: string;
    };
    verificarCommitment(seed: string, commitment: string): boolean;
    realizarSorteio(seed: string, cotasAtivas: number[], numeroAssembleia: number): ResultadoSorteio;
    verificarResultado(seed: string, cotasAtivas: number[], numeroAssembleia: number, cotaEsperada: number): boolean;
    private fisherYatesShuffle;
}
export {};
