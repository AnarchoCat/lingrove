import { Mmimy } from '@/extension'
import * as vscode from 'vscode'
export default async function selectLanguage() {
	// Define the options
	const options: Record<string, string> = {
		English: 'en',
		Vietnamese: 'vi',
		Spanish: 'es',
	}
	// Show the quick pick list
	const selectedOption = await vscode.window.showQuickPick(
		Object.keys(options),
		{
			placeHolder: 'Select a language',
			canPickMany: false,
			ignoreFocusOut: true,
		},
	)
	if (selectedOption) {
		vscode.window.showInformationMessage(`Language set to: ${selectedOption}`)
		Mmimy.getInstance().language = options[selectedOption]
	} else {
		vscode.window.showInformationMessage('No language selected.')
	}
}
