import { carregarDicionarioGithub } from "../api/api-consulta-gitHub";
import { traduzirPalavra } from "../api/api-traducao";
import { traducoesCache } from "../utils/cache";
import { normalizarPalavra } from "../utils/regex";

export async function traduzirPalavraComGitHubOuApi(word: string): Promise<string | undefined> {
    const dicionario = await carregarDicionarioGithub();
    const wordSemEspaco = word.trim();

    if (dicionario[word]?.traducao) {
        const traducao: string | undefined = dicionario[wordSemEspaco].traducao;
        traducoesCache.set(wordSemEspaco, traducao);

        return traducao;
    }

    const normalizada = normalizarPalavra(wordSemEspaco);
    const traducao = await traduzirPalavra(normalizada);

    if (traducao) {
        traducoesCache.set(wordSemEspaco, traducao);
    }

    return traducao;
}
