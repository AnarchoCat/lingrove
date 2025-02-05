import * as vscode from 'vscode'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import selectLanguage from './commands/selectLanguage'
import changeTextEditorSelectionListener from './listeners/changeTextEditorSelectionListener'
import changeActiveTextEditorListener from './listeners/changeActiveTextEditorListener'
import { Dictionary } from '@/dictionary'
import path from 'path'
export default class Mmimy {
	public readonly context: vscode.ExtensionContext
	private static instance?: Mmimy
	private languageStatus: vscode.StatusBarItem
	public readonly dictionary: Dictionary

	private constructor(context: vscode.ExtensionContext) {
		this.context = context
		const dictionaryFilePath = path.join(
			this.context.globalStorageUri.fsPath,
			'dictionary.json',
		)
		this.dictionary = new Dictionary(dictionaryFilePath)
		this.context.subscriptions.push(this.dictionary)
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

	private registerViews() {
		const dictionaryViewProvider = DictionaryViewProvider.getInstance(
			Mmimy.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				DictionaryViewProvider.viewType,
				dictionaryViewProvider,
			),
		)
		const searchViewProvider = SearchViewProvider.getInstance(
			Mmimy.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				SearchViewProvider.viewType,
				searchViewProvider,
			),
		)
	}

	private registerListeners() {
		this.context.subscriptions.push(
			vscode.window.onDidChangeTextEditorSelection(
				changeTextEditorSelectionListener,
			),
		)
		this.context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(changeActiveTextEditorListener),
		)
	}

	private registerStatusBarItems() {
		// Call the show method to show status bar items
		this.languageStatus.show()
		this.context.subscriptions.push(this.languageStatus)
	}

	public activate(): void {
		this.loadConfig()
		this.registerCommands()
		this.registerViews()
		this.registerListeners()
		this.registerStatusBarItems()
	}
}
