import * as vscode from 'vscode'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import { languageStatus, selectLanguage } from './commands/selectLanguage'
import { selectListener } from './listeners/selectListener'

export function activate(context: vscode.ExtensionContext) {
	const dictionaryViewProvider = new DictionaryViewProvider(context)
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			DictionaryViewProvider.viewType,
			dictionaryViewProvider,
		),
	)

	const searchViewProvider = new SearchViewProvider(context)
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SearchViewProvider.viewType,
			searchViewProvider,
		),
	)

	context.subscriptions.push(selectListener)

	context.subscriptions.push(
		vscode.commands.registerCommand('mmimy.selectLanguage', selectLanguage),
	)

	context.subscriptions.push(languageStatus())
}

export function deactivate() {}
