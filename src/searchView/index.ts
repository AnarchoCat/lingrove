import * as vscode from 'vscode'
import html from './index.html?raw'
import { getMediaUri, renderTemplate } from '@/utils'
import { DictionaryViewProvider } from '@/dictionaryView'

export class SearchViewProvider implements vscode.WebviewViewProvider {
	static viewType = 'mmimy.searchView'
	static currentInstance?: SearchViewProvider
	private _view?: vscode.WebviewView
	private _context: vscode.ExtensionContext
	constructor(context: vscode.ExtensionContext) {
		this._context = context
		SearchViewProvider.currentInstance = this
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
	): Thenable<void> | void {
		this._view = webviewView
		this._view.webview.options = {
			...this._view.webview.options,
			enableScripts: true,
		}
		this._view.webview.html = this._getHtmlForWebview()
		this._view.webview.onDidReceiveMessage((e) => {
			const dictionary = DictionaryViewProvider.getInstance().dictionary
			switch (e.command) {
				case 'searchByPrefix':
					if (dictionary) {
						const matches = dictionary.search(e.prefix)
						this._view?.webview.postMessage({
							matches: matches,
						})
					}
					break
				case 'setWord':
					DictionaryViewProvider.getInstance().setWord(e.word)
					break
			}
		})
	}

	public search(word: string) {
		const dictionary = DictionaryViewProvider.getInstance().dictionary
		if (dictionary) {
			const matches = dictionary.search(word)
			this._view?.webview.postMessage({
				input: word,
				matches: matches,
			})
		}
	}

	private _getHtmlForWebview() {
		const data: Record<string, string> = {
			js: getMediaUri(
				this._view!.webview,
				this._context.extensionUri,
				'searchView.js',
			).toString(),
			css: getMediaUri(
				this._view!.webview,
				this._context.extensionUri,
				'searchView.css',
			).toString(),
		}
		return renderTemplate(html, data)
	}
}
