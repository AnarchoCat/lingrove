import Lingrove from '@/lingrove'
import * as vscode from 'vscode'

export default function () {
	const lingrove = Lingrove.getInstance()
	lingrove.dictionary.save()
	vscode.window.showInformationMessage('Dictionary successfully saved.')
}
