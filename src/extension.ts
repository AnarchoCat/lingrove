import * as vscode from 'vscode'
import Mmimy from '@/mmimy'

export function activate(context: vscode.ExtensionContext) {
	const mmimy = Mmimy.getInstance(context)
	mmimy.activate()
}

export function deactivate() {}
