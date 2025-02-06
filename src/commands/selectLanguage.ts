import Mmimy from '@/mmimy'
import * as vscode from 'vscode'
import languages from '@assets/languages.json'

interface Option extends vscode.QuickPickItem {
	code: string
}

export default async function selectLanguage() {
	const options: Option[] = []
	const values = languages.enum
	const labels = languages.enumItemLabels
	const descriptions = languages.enumDescriptions
	for (let i = 0; i < values.length; i++) {
		options.push({
			label: labels[i],
			code: values[i],
			description: descriptions[i],
		})
	}
	const additionalLanguages =
		vscode.workspace
			.getConfiguration('mmimy')
			.get<Option[]>('additionalLanguages') ?? []
	// Show the quick pick list
	const selectedOption = await vscode.window.showQuickPick(
		options.concat(additionalLanguages),
		{
			placeHolder: 'Select a language',
			canPickMany: false,
		},
	)
	if (selectedOption) {
		vscode.window.showInformationMessage(
			`Language set to: ${selectedOption.label}`,
		)
		Mmimy.getInstance().language = selectedOption.code
	} else {
		vscode.window.showInformationMessage('No language selected.')
	}
}
