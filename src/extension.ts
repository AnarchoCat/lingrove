import * as vscode from 'vscode'
import { register } from '@/catScratchEditor'
import { register as register1 } from '@/wordNotesEditor'

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mmimy.hello', () => {
		vscode.window.showInformationMessage('Hello World from mmimy!')
	})

	context.subscriptions.push(disposable)
	context.subscriptions.push(register(context))
	context.subscriptions.push(register1(context))
}

export function deactivate() {}
