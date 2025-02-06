import * as vscode from 'vscode'
import Mmimy from '@/mmimy'
import html from './index.html?raw'
import { getMediaUri, renderTemplate } from '@/utils'
import { fetchAndParseDictionary } from './tratu'

export class TratuViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'mmimy.tratuView'
	private static instance?: TratuViewProvider
	private readonly extension: Mmimy
	private view?: vscode.WebviewView

	private constructor(extension: Mmimy) {
		this.extension = extension
	}

	public static getInstance(extension?: Mmimy) {
		if (!TratuViewProvider.instance) {
			if (!extension) {
				throw new Error(
					'The instance of TratuViewProvider has not been initialized. The extension argument must be provided.',
				)
			}
			TratuViewProvider.instance = new TratuViewProvider(extension)
		}
		return TratuViewProvider.instance
	}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this.view = webviewView
		this.view.webview.options = {
			...this.view.webview.options,
			enableScripts: true,
		}
		this.view.webview.html = this.getHtmlForWebview()
		this.view.webview.onDidReceiveMessage(async (e) => {
			if (e.command === 'search') {
				const data = await fetchAndParseDictionary(
					`https://tratu.coviet.vn/hoc-tieng-anh/tu-dien/lac-viet/V-V/${encodeURIComponent(e.word)}.html`,
				)
				this.view?.webview.postMessage({
					data: data,
				})
			}
		})
	}

	private getHtmlForWebview() {
		const data: Record<string, string> = {
			js: getMediaUri(
				this.view!.webview,
				this.extension.context.extensionUri,
				'tratu.js',
			).toString(),
			css: getMediaUri(
				this.view!.webview,
				this.extension.context.extensionUri,
				'tratu.css',
			).toString(),
		}
		return renderTemplate(html, data)
	}
}
