import * as vscode from 'vscode'
export async function selectLanguage() {
	const config = vscode.workspace.getConfiguration('mmimy')
	// Define the options
	const options = ['en', 'vi', 'es']
	// Show the quick pick list
	const selectedOption = await vscode.window.showQuickPick(options, {
		placeHolder: 'Select a language',
		canPickMany: false,
		ignoreFocusOut: true,
	})

	if (selectedOption) {
		// Update the setting with the selected option
		await config.update(
			'language',
			selectedOption,
			vscode.ConfigurationTarget.Global,
		)
		vscode.window.showInformationMessage(`Language set to: ${selectedOption}`)
	} else {
		vscode.window.showInformationMessage('No language selected.')
	}
}
