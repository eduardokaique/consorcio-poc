import { CategoriaConsorcio } from '../enums/categoria.enum';
export declare class CriarGrupoDto {
    categoria: CategoriaConsorcio;
    valorCredito: number;
    prazoMeses: number;
    totalParticipantes: number;
    taxaAdminPercentual: number;
    fundoReservaPercentual: number;
}
