import Lingrove from '@/lingrove'
import * as vscode from 'vscode'

interface Option extends vscode.QuickPickItem {
	code: string
}

export default async function selectLanguage() {
	const lingrove = Lingrove.getInstance()
	const options: Option[] = lingrove.languages
	// Show the quick pick list
	const selectedOption = await vscode.window.showQuickPick(options, {
		placeHolder: 'Select a language',
		canPickMany: false,
	})
	if (selectedOption && selectedOption.code !== lingrove.language) {
		vscode.window.showInformationMessage(
			`Language set to: ${selectedOption.label}`,
		)
		lingrove.language = selectedOption.code
	}
}
