import * as vscode from 'vscode'
import { register } from './testEditor'

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mmimy.hello', () => {
		vscode.window.showInformationMessage('Hello World from mmimy!')
	})

	context.subscriptions.push(disposable)
	context.subscriptions.push(register(context))
}

export function deactivate() {}
