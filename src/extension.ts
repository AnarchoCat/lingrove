import * as vscode from 'vscode'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import { languageStatus } from './commands/selectLanguage'
import { selectListener } from './listeners/selectListener'
import { registerCommands } from './commands'

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

	registerCommands(context)
	context.subscriptions.push(selectListener)
	context.subscriptions.push(languageStatus())
}

export function deactivate() {}
