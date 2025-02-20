import * as vscode from 'vscode'
import Mmimy from '@/mmimy'
import '@vscode/codicons/src/icons/notebook.svg?no-inline'

export function activate(context: vscode.ExtensionContext) {
	const mmimy = Mmimy.getInstance(context)
	mmimy.activate()
}

export function deactivate() {}
