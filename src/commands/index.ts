import * as vscode from 'vscode'
import { selectLanguage } from './selectLanguage'
export function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('mmimy.selectLanguage', selectLanguage),
	)
}
