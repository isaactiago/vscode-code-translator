import * as vscode from 'vscode';
import { traducoesCache } from './utils/cache';
import { traduzirPalavraComGitHubOuApi } from './services/traducao-service';

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
		let traducao: string | undefined = traducoesCache.get(palavraSem$);

		if (!traducao) {
			traducao = await traduzirPalavraComGitHubOuApi(palavraSem$);
		}

		if (traducao) {
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

			const traducao = traducoesCache.get(palavraSem$);
			if (!traducao) {
				return;
			}

			const markdown = new vscode.MarkdownString(`**${palavraSem$}** → ${traducao}`);
			markdown.isTrusted = true;
			return new vscode.Hover(markdown);
		}
	});

	context.subscriptions.push(provider);
}

export function deactivate() { }
