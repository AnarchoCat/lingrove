import Mmimy from '@/mmimy'
import * as vscode from 'vscode'
import languages from '@assets/languages.json'

interface Option extends vscode.QuickPickItem {
	value: string
}

export default async function selectLanguage() {
	const options: Option[] = []
	const values = languages.enum
	const labels = languages.enumItemLabels
	const descriptions = languages.enumDescriptions
	for (let i = 0; i < values.length; i++) {
		options.push({
			label: labels[i],
			value: values[i],
			description: descriptions[i],
		})
	}
	// Show the quick pick list
	const selectedOption = await vscode.window.showQuickPick(options, {
		placeHolder: 'Select a language',
		canPickMany: false,
		ignoreFocusOut: true,
	})
	if (selectedOption) {
		vscode.window.showInformationMessage(
			`Language set to: ${selectedOption.label}`,
		)
		Mmimy.getInstance().language = selectedOption.value
	} else {
		vscode.window.showInformationMessage('No language selected.')
	}
}
