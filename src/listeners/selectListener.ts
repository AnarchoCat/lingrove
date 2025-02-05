import * as vscode from 'vscode'
import { DictionaryViewProvider } from '@/dictionaryView'
import { SearchViewProvider } from '@/searchView'
export default vscode.window.onDidChangeTextEditorSelection((e) => {
	const editor = e.textEditor
	const selection = editor.selection
	if (!selection.isEmpty) {
		const selectedText = editor.document.getText(selection).trim()
		if (!selectedText) {
			return
		}
		DictionaryViewProvider.currentInstance?.setWord(selectedText)
		SearchViewProvider.currentInstance?.search(selectedText)
	}
})
