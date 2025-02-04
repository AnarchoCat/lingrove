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

	const addToDictionaryCommand = vscode.commands.registerCommand(
		'mmimy.addToDictionary',
		() => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage('No active editor found.')
				return
			}

			const selection = editor.selection
			const selectedText = editor.document.getText(selection).trim()

			if (!selectedText) {
				vscode.window.showErrorMessage('No text selected.')
				return
			}
			DictionaryViewProvider.currentInstance?.setWord(selectedText)
		},
	)

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

	const selectListener = vscode.window.onDidChangeTextEditorSelection((e) => {
		const editor = e.textEditor
		const selection = editor.selection

		// Check if there is a selection (not just a cursor position)
		if (!selection.isEmpty) {
			vscode.commands.executeCommand('mmimy.addToDictionary')
		}
	})
	context.subscriptions.push(selectListener)
	context.subscriptions.push(addToDictionaryCommand)
	context.subscriptions.push(
		vscode.commands.registerCommand('mmimy.selectLanguage', selectLanguage),
	)
}

export function deactivate() {}
