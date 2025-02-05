import * as vscode from 'vscode'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import selectLanguage from './commands/selectLanguage'
import selectListener from './listeners/selectListener'

export class Mmimy {
	public readonly context: vscode.ExtensionContext
	private static instance: Mmimy
	private languageStatus: vscode.StatusBarItem

	private constructor(context: vscode.ExtensionContext) {
		this.context = context
		this.languageStatus = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			1,
		)
		this.languageStatus.command = 'mmimy.selectLanguage'
	}

	public static getInstance(context?: vscode.ExtensionContext): Mmimy {
		if (!Mmimy.instance) {
			if (!context) {
				throw new Error(
					'Singleton instance is not initialized. Pass arguments the first time.',
				)
			}
			Mmimy.instance = new Mmimy(context)
		}
		return Mmimy.instance
	}

	private registerCommands(): void {
		this.context.subscriptions.push(
			vscode.commands.registerCommand('mmimy.selectLanguage', selectLanguage),
		)
	}

	public get language(): string {
		return this.context.globalState.get<string>('language') ?? 'en'
	}

	public set language(value: string) {
		this.context.globalState.update('language', value)
		this.languageStatus.text = value
	}

	private loadConfig() {
		const config = vscode.workspace.getConfiguration('mmimy')
		const defaultLanguage = config.get<string>('defaultLanguage')
		this.language = defaultLanguage ?? 'en'
	}

	public activate(): void {
		this.loadConfig()
		this.registerCommands()
		const dictionaryViewProvider = new DictionaryViewProvider(this.context)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				DictionaryViewProvider.viewType,
				dictionaryViewProvider,
			),
		)
		const searchViewProvider = new SearchViewProvider(this.context)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				SearchViewProvider.viewType,
				searchViewProvider,
			),
		)
		this.context.subscriptions.push(selectListener)
		// Show language statusbar item
		this.languageStatus.show()
		this.context.subscriptions.push(this.languageStatus)
	}
}

export function activate(context: vscode.ExtensionContext) {
	const mmimy = Mmimy.getInstance(context)
	mmimy.activate()
}

export function deactivate() {}
