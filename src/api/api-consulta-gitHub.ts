import { Dicionario } from "../types/Dicionario";
import { BASE_URL } from "../utils/base-api";

let dicionarioCache: Dicionario | null = null;

export const carregarDicionarioGithub = async (): Promise<Dicionario> => {
	if (dicionarioCache) {
		return dicionarioCache;
	}

	try {
		const response = await fetch(BASE_URL);
		dicionarioCache = await response.json() as Dicionario;
		return dicionarioCache;
	} catch (error) {
		console.error("Erro ao carregar dicionário do GitHub:", error);
		return {};
	}
};
