import * as vscode from 'vscode'
import { register } from '@/catScratchEditor'
import { register as register1 } from '@/wordNotesEditor'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import { selectLanguage } from './commands/selectLanguage'

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('mmimy.hello', () => {
		vscode.window.showInformationMessage('Hello World from mmimy!')
	})

	context.subscriptions.push(disposable)
	context.subscriptions.push(register(context))
	context.subscriptions.push(register1(context))

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

	context.subscriptions.push(
		vscode.commands.registerCommand('mmimy.selectLanguage', selectLanguage),
	)
}

export function deactivate() {}
