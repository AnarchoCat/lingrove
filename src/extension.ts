import * as vscode from 'vscode'
import Lingrove from '@/lingrove'
import '@vscode/codicons/src/icons/notebook.svg?no-inline'

export function activate(context: vscode.ExtensionContext) {
	const lingrove = Lingrove.getInstance(context)
	lingrove.activate()
}

export function deactivate() {}
