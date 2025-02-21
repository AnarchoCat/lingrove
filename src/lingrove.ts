import * as vscode from 'vscode'
import { DictionaryViewProvider } from './dictionaryView'
import { SearchViewProvider } from './searchView'
import selectLanguage from './commands/selectLanguage'
import saveDictionary from './commands/saveDictionary'
import convertVietnameseToneStyle from './commands/convertVietnameseToneStyle'
import changeTextEditorSelectionListener from './listeners/changeTextEditorSelectionListener'
import changeActiveTextEditorListener from './listeners/changeActiveTextEditorListener'
import { Dictionary } from '@/dictionary'
import path from 'path'
import { TratuViewProvider } from './tratu'
import { OllamaViewProvider } from './ollama'

interface Language {
	code: string
	label: string
	description: string
}

export default class Lingrove {
	public readonly context: vscode.ExtensionContext
	private static instance?: Lingrove
	private languageStatus: vscode.StatusBarItem
	private currentLanguage: string
	public languages: Language[]
	public readonly dictionary: Dictionary

	private constructor(context: vscode.ExtensionContext) {
		this.context = context
		const config = vscode.workspace.getConfiguration('lingrove')
		const languages = config.get<Language[]>('languages')
		if (languages === undefined || languages.length < 1) {
			throw Error(
				'Setting lingrove.languages must contain at least one language',
			)
		}
		this.languages = languages
		this.currentLanguage = languages[0].code
		const dictionaryFileName =
			vscode.workspace
				.getConfiguration('lingrove')
				.get<string>('dictionaryFileName') ?? 'dictionary.json'
		const dictionaryFilePath = path.join(
			this.context.globalStorageUri.fsPath,
			dictionaryFileName,
		)
		this.dictionary = new Dictionary(dictionaryFilePath)
		this.context.subscriptions.push(this.dictionary)
		this.languageStatus = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			1,
		)
		this.languageStatus.command = 'lingrove.selectLanguage'
	}

	public static getInstance(context?: vscode.ExtensionContext): Lingrove {
		if (!Lingrove.instance) {
			if (!context) {
				throw new Error(
					'Singleton instance is not initialized. Pass arguments the first time.',
				)
			}
			Lingrove.instance = new Lingrove(context)
		}
		return Lingrove.instance
	}

	private registerCommands(): void {
		this.context.subscriptions.push(
			vscode.commands.registerCommand(
				'lingrove.selectLanguage',
				selectLanguage,
			),
		)
		this.context.subscriptions.push(
			vscode.commands.registerCommand(
				'lingrove.saveDictionary',
				saveDictionary,
			),
		)
		this.context.subscriptions.push(
			vscode.commands.registerCommand(
				'lingrove.convertVietnameseToneStyle',
				convertVietnameseToneStyle,
			),
		)
	}

	public get language(): string {
		return this.currentLanguage
	}

	public set language(value: string) {
		this.currentLanguage = value
		this.languageStatus.text = value
		vscode.commands.executeCommand(
			'setContext',
			'lingrove.tratuView.show',
			value === 'vi',
		)
	}

	private registerViews() {
		const dictionaryViewProvider = DictionaryViewProvider.getInstance(
			Lingrove.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				DictionaryViewProvider.viewType,
				dictionaryViewProvider,
			),
		)
		const searchViewProvider = SearchViewProvider.getInstance(
			Lingrove.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				SearchViewProvider.viewType,
				searchViewProvider,
			),
		)
		const tratuViewProvider = TratuViewProvider.getInstance(
			Lingrove.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				TratuViewProvider.viewType,
				tratuViewProvider,
			),
		)
		const ollamaViewProvider = OllamaViewProvider.getInstance(
			Lingrove.getInstance(),
		)
		this.context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				OllamaViewProvider.viewType,
				ollamaViewProvider,
			),
		)
		vscode.commands.executeCommand(
			'setContext',
			'lingrove.tratuView.show',
			this.language === 'vi',
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
		this.registerCommands()
		this.registerViews()
		this.registerListeners()
		this.registerStatusBarItems()
	}
}
