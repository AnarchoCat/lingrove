import * as vscode from 'vscode'
import * as path from 'path'
import { getNonce, getMediaUri, renderTemplate, cspMeta } from '@/utils'
import html from './index.html?raw'
import { Dictionary } from '@/dictionaryData'

export class DictionaryViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'mmimy.dictionaryView'
	public static currentInstance?: DictionaryViewProvider

	private _view?: vscode.WebviewView
	private _word: string = ''
	private readonly _context: vscode.ExtensionContext
	public dictionary: Dictionary

	constructor(context: vscode.ExtensionContext) {
		DictionaryViewProvider.currentInstance = this
		this._context = context
		// Initialize the dictionary file path
		const dictionaryFilePath = path.join(
			context.globalStorageUri.fsPath,
			'dictionary.json',
		)
		this.dictionary = new Dictionary(this._context, dictionaryFilePath)
		context.subscriptions.push(this.dictionary)
	}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this._view = webviewView

		// Set the WebView options
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this._context.extensionUri, 'dist/media'),
			],
		}
		// Set the WebView content
		this._view!.webview.html = this._getHtmlForWebview()

		// Handle messages from the WebView
		webviewView.webview.onDidReceiveMessage(
			(message) => {
				switch (message.command) {
					case 'saveNote':
						this._saveNote(message.text, message.note)
						return
				}
			},
			null,
			[],
		)

		vscode.window.onDidChangeActiveTextEditor(() => {
			this.dictionary.dispose()
		})

		webviewView.onDidDispose(() => {
			this.dictionary.dispose()
		})
	}

	public setWord(word: string) {
		this._word = word
		this._updateWebviewContent()
	}

	private _updateWebviewContent() {
		if (!this._view) {
			return
		}
		const note = this.dictionary.query(this._word)
		this._view.webview.postMessage({
			word: this._word,
			note: note,
		})
	}

	private _saveNote(text: string, note: string) {
		if (text) {
			this.dictionary.record(text, note)
			vscode.window.showInformationMessage(`Saved note for "${text}".`)
		}
	}

	private _getHtmlForWebview(): string {
		const nonce = getNonce()
		const data: Record<string, string> = {
			jsPath: getMediaUri(
				this._view!.webview,
				this._context.extensionUri,
				'dictionaryView.js',
			).toString(),
			cssPath: getMediaUri(
				this._view!.webview,
				this._context.extensionUri,
				'dictionaryView.css',
			).toString(),
			nonce: nonce,
			cspMeta: cspMeta(this._view!.webview.cspSource, nonce),
		}
		return renderTemplate(html, data)
	}
}
