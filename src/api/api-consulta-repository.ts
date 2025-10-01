import { DicionarioType } from "../types/Dicionario";

export async function getTraducaoDoDicionario(): Promise<DicionarioType | undefined> {
    try {
        const url = "https://raw.githubusercontent.com/isaactiago/vscode-var-translator-dictionary/main/dictionary.json";

        const response = await fetch(url);
        const data: DicionarioType = await response.json() as DicionarioType;

        return data;
    } catch (error) {
        return undefined;
    }
}
