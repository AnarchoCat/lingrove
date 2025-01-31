import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { getNonce, getMediaUri, renderTemplate, cspMeta } from '@/utils'
import html from './index.html?raw'

export class DictionaryViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'mmimy.dictionaryView'
	public static currentInstance?: DictionaryViewProvider

	private _view?: vscode.WebviewView
	private _selectedText: string = ''
	private _dictionaryFilePath: string
	private _context: vscode.ExtensionContext

	constructor(private readonly context: vscode.ExtensionContext) {
		DictionaryViewProvider.currentInstance = this
		this._context = context
		// Initialize the dictionary file path
		this._dictionaryFilePath = path.join(
			context.globalStorageUri.fsPath,
			'dictionary.json',
		)
		// Ensure the dictionary file exists
		if (!fs.existsSync(context.globalStorageUri.fsPath)) {
			fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true })
		}
		if (!fs.existsSync(this._dictionaryFilePath)) {
			fs.writeFileSync(this._dictionaryFilePath, JSON.stringify({}, null, 2))
		}
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
	}

	public setSelectedText(selectedText: string) {
		this._selectedText = selectedText
		this._updateWebviewContent()
	}

	private _updateWebviewContent() {
		if (!this._view) {
			return
		}
		const dictionary = this._loadDictionary()

		const note = dictionary[this._selectedText] || ''

		this._view.webview.postMessage({
			word: this._selectedText,
			note: note,
		})
	}

	private _saveNote(text: string, note: string) {
		const dictionary = this._loadDictionary()
		dictionary[text] = note
		this._saveDictionary(dictionary)

		vscode.window.showInformationMessage(`Saved note for "${text}".`)
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
	private _loadDictionary(): { [key: string]: string } {
		try {
			const data = fs.readFileSync(this._dictionaryFilePath, 'utf8')
			return JSON.parse(data)
		} catch {
			vscode.window.showErrorMessage('Failed to load the dictionary.')
			return {}
		}
	}

	// Helper function to save the dictionary
	private _saveDictionary(dictionary: { [key: string]: string }) {
		try {
			fs.writeFileSync(
				this._dictionaryFilePath,
				JSON.stringify(dictionary, null, 4),
			)
		} catch {
			vscode.window.showErrorMessage('Failed to save the dictionary.')
		}
	}
}
