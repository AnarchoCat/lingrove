import * as vscode from 'vscode'

class TestEditorProvider implements vscode.CustomTextEditorProvider {
	private readonly context: vscode.ExtensionContext
	constructor(context: vscode.ExtensionContext) {
		this.context = context
	}
	resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		token: vscode.CancellationToken,
	): Thenable<void> | void {
		webviewPanel.webview.options = {
			enableScripts: true,
		}
		webviewPanel.webview.html = `
    <!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Test</title>
				<link rel="stylesheet" href="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'test.css'))}">
			</head>
			<body>
					<h1 class="font-bold text-red-800" id="lines-of-code-counter">0</h1>
					<button class="btn">Click</button>

					<script src="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'test.js'))}">
					</script>
			</body>
			</html>
    `
	}
}

export function register(context: vscode.ExtensionContext) {
	return vscode.window.registerCustomEditorProvider(
		'mmimy.test',
		new TestEditorProvider(context),
	)
}
