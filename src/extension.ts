import * as vscode from 'vscode';
import { traduzirPalavra } from './api/api-traducao';
import { normalizarPalavra } from './utils/regex';

const traducoesCache = new Map<string, string>();

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.traduzirSelecionado', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const posicaoSelecionada = editor.selection;
		const palavraOriginal = editor.document.getText(posicaoSelecionada);

		if (!palavraOriginal) {
			vscode.window.showInformationMessage('Nenhuma palavra selecionada');
			return;
		}

		const palavraSem$ = palavraOriginal.replace(/^\$/, '');
		const palavraNormalizada = normalizarPalavra(palavraSem$);

		const traducao = await traduzirPalavra(palavraNormalizada);
		if (traducao) {
			traducoesCache.set(palavraOriginal, traducao);
			traducoesCache.set(palavraSem$, traducao);
		}

		await vscode.commands.executeCommand('editor.action.showHover');
	});

	context.subscriptions.push(disposable);

	const provider = vscode.languages.registerHoverProvider('*', {
		provideHover(docs, pos) {
			const range = docs.getWordRangeAtPosition(pos);
			
			if (!range) {
				return;
			}

			const palavra = docs.getText(range);
			const palavraSem$ = palavra.replace(/^\$/, '');

			const traducao = traducoesCache.get(palavra) || traducoesCache.get(palavraSem$);

			if (traducao) {
				const markdown = new vscode.MarkdownString(`**${palavraSem$}** → ${traducao}`);
				markdown.isTrusted = true;
				return new vscode.Hover(markdown);
			}
		}
	});

	context.subscriptions.push(provider);
}

export function deactivate() {}
