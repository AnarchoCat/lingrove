import fs from 'fs'
import path from 'path'
import * as vscode from 'vscode'
import TrieSearch from 'trie-search'
export class Dictionary implements vscode.Disposable {
	static defaultLanguage: string = 'en'
	_path: string
	_data: {
		[language: string]: Record<string, string>
	}
	_tries: {
		[language: string]: TrieSearch<{
			_key_: string
			value: string
		}>
	}
	constructor(filePath: string) {
		this._path = filePath
		this._data = this._load()
		this._tries = {}
	}

	public dispose() {
		this._save()
	}

	public record(word: string, definition: string, language?: string) {
		if (word) {
			if (language === undefined) {
				language = Dictionary.defaultLanguage
			}
			if (!(language in this._data)) {
				this._data[language] = {}
			}
			if (word in this._data[language] && definition.length < 1) {
				delete this._data[language][word]
				if (language in this._tries) {
					this._tries[language].remove(word)
				}
			} else {
				this._data[language][word] = definition
				if (language in this._tries) {
					this._tries[language].addFromObject({
						[word]: definition,
					})
				}
			}
		}
	}

	public query(word: string, language?: string) {
		if (language === undefined) {
			language = Dictionary.defaultLanguage
		}
		if (!(language in this._data)) {
			return undefined
		}
		return this._data[language][word]
	}

	public search(prefix: string, language?: string): string[] {
		if (language === undefined) {
			language = Dictionary.defaultLanguage
		}

		if (!(language in this._data)) {
			return []
		}
		if (this._tries[language] === undefined) {
			this._tries[language] = new TrieSearch()
			this._tries[language].addFromObject(this._data[language])
		}
		const results = this._tries[language].search(prefix)
		const matches = results.map((result) => result._key_)
		return matches
	}

	private _load() {
		if (fs.existsSync(this._path)) {
			return JSON.parse(fs.readFileSync(this._path, 'utf-8'))
		}
		return {}
	}

	private _save() {
		const dir = path.dirname(this._path)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}
		fs.writeFileSync(this._path, JSON.stringify(this._data, null, 2))
	}
}
