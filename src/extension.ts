import * as vscode from 'vscode';
import { traduzirPalavra } from './api/api-traducao';
import { getTraducaoDoDicionario } from './api/api-consulta-repository';
import { normalizarPalavra } from './utils/regex';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.traduzirSelecionado', async () => {
		const editor = vscode.window.activeTextEditor;

		if (! editor) {
			return;
		}

		const posicaoSelecionada = editor.selection;
		let palavraSelecionada = editor.document.getText(posicaoSelecionada);

		if (! palavraSelecionada) {
			vscode.window.showInformationMessage('Nenhuma palavra selecionada');
			return;
		}

		palavraSelecionada = normalizarPalavra(palavraSelecionada);

	/* 	const dicionario = await getTraducaoDoDicionario();
		const traducaoDoDicionarioFinded = dicionario?.[palavraSelecionada]; */

		let traducao: string | void;

		/* if (traducaoDoDicionarioFinded !== undefined) {
			traducao = traducaoDoDicionarioFinded.traducao;
		} else {
		} */



		traducao = await traduzirPalavra(palavraSelecionada);



		const provider = vscode.languages.registerHoverProvider('*', {
			provideHover(docs, pos) {
				const range = docs.getWordRangeAtPosition(pos);
				if (range ) {
					const markdown = new vscode.MarkdownString(`**${palavraSelecionada}** → ${traducao}`);
					markdown.isTrusted = true;
					console.log(palavraSelecionada);
					return new vscode.Hover(markdown);
				}
			}
		});

		context.subscriptions.push(provider);

		await vscode.commands.executeCommand('editor.action.showHover');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
