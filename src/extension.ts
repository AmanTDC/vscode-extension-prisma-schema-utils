import * as vscode from 'vscode';
import { translate } from './features/translater';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('prisma-schema-mapper.snakeToCamel', async (e) => {
		vscode.window.withProgress({
			location: 15,
			cancellable: true,
			title: "Translating..."
		}, async () => {
			let input = await vscode.workspace.fs.readFile(e);
			let output = await vscode.workspace.fs.writeFile(e, translate(input));
		});
	}));
}
export function deactivate() {}
