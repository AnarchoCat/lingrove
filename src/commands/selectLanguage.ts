import { getLanguage } from '@/utils'
import * as vscode from 'vscode'
export async function selectLanguage() {
	const config = vscode.workspace.getConfiguration('mmimy')
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
		// Update the setting with the selected option
		await config.update(
			'language',
			options[selectedOption],
			vscode.ConfigurationTarget.Global,
		)
		vscode.window.showInformationMessage(`Language set to: ${selectedOption}`)
	} else {
		vscode.window.showInformationMessage('No language selected.')
	}
}

export function languageStatus() {
	const statusbarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		1,
	)
	vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('mmimy.language')) {
			statusbarItem.text = getLanguage()
		}
	})
	statusbarItem.text = getLanguage()
	statusbarItem.command = 'mmimy.selectLanguage'
	statusbarItem.show()
	return statusbarItem
}
