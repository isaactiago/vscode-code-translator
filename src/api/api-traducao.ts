export async function traduzirPalavra(word: string): Promise<string> {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(word)}`;

        const response = await fetch(url);
        const data = await response.json() as any[][][];

        const traducao = data?.[0]?.[0]?.[0] ?? word;

        return traducao;
    } catch (error) {
        console.error('Erro ao traduzir:', error);
        return word;
    }
}


