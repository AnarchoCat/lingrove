import * as vscode from 'vscode'
import html from './index.html?raw'

class CatScratchEditorProvider implements vscode.CustomTextEditorProvider {
	private readonly context: vscode.ExtensionContext
	constructor(context: vscode.ExtensionContext) {
		this.context = context
	}
	resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		token: vscode.CancellationToken,
	): Thenable<void> | void {
		webviewPanel.webview.options = {
			enableScripts: true,
		}
		const data: Record<string, vscode.Uri> = {
			cssPath: webviewPanel.webview.asWebviewUri(
				vscode.Uri.joinPath(
					this.context.extensionUri,
					'dist/media',
					'catScratchEditor.css',
				),
			),
			jsPath: webviewPanel.webview.asWebviewUri(
				vscode.Uri.joinPath(
					this.context.extensionUri,
					'dist/media',
					'catScratchEditor.js',
				),
			),
		}
		const interpolatedHtml = html.replace(
			/\{\{([^{}]*?)\}\}/g,
			(_, key: string) => {
				return data[key.trim()].toString() || ''
			},
		)
		webviewPanel.webview.html = interpolatedHtml
	}
}

export function register(context: vscode.ExtensionContext) {
	return vscode.window.registerCustomEditorProvider(
		'mmimy.catScratch',
		new CatScratchEditorProvider(context),
	)
}
