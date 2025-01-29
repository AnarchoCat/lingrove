import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mmimy.hello', () => {
		vscode.window.showInformationMessage('Hello World from mmimy!')
	})

	context.subscriptions.push(disposable)
}

export function deactivate() {}
