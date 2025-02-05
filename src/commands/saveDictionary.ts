import Mmimy from '@/mmimy'
import * as vscode from 'vscode'

export default function () {
	const mmimy = Mmimy.getInstance()
	mmimy.dictionary.save()
	vscode.window.showInformationMessage('Dictionary successfully saved.')
}
