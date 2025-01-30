import * as vscode from 'vscode'

class WordNotesEditorProvider implements vscode.CustomTextEditorProvider {
	private static readonly viewType = 'wordNotesEditor'
	private notes: { [word: string]: string } = {}

	constructor(private readonly context: vscode.ExtensionContext) {}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
	): Promise<void> {
		const webview = webviewPanel.webview

		webview.options = {
			enableScripts: true,
		}

		webview.html = this.getHtmlForWebview(webview, document.getText())

		webview.onDidReceiveMessage((message) => {
			switch (message.command) {
				case 'addNote':
					this.notes[message.word] = message.note
					this.updateWebview(webview, document.getText())
					break
				case 'getNote':
					webview.postMessage({
						command: 'showNote',
						word: message.word,
						note: this.notes[message.word] || '',
					})
					break
			}
		})
	}

	private updateWebview(webview: vscode.Webview, text: string) {
		webview.html = this.getHtmlForWebview(webview, text)
	}

	private getHtmlForWebview(webview: vscode.Webview, text: string): string {
		const words = text.split(/\s+/).filter((word) => word.trim().length > 0)
		const wordHtml = words
			.map((word) => `<span class="word" data-word="${word}">${word}</span>`)
			.join(' ')

		const nonce = getNonce()

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Word Notes Editor</title>
				<style>
					.word {
						cursor: pointer;
						color: blue;
						text-decoration: underline;
					}
					.word:hover {
						color: darkblue;
					}
					#noteModal {
						display: none;
						position: fixed;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background-color: white;
						border: 1px solid #ccc;
						padding: 20px;
						box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
						z-index: 1000;
					}
					#noteModal input {
						width: 100%;
						margin-bottom: 10px;
					}
					#noteModal button {
						margin-right: 10px;
					}
					#modalOverlay {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.5);
						z-index: 999;
					}
				</style>
			</head>
			<body>
				<div>${wordHtml}</div>
	
				<!-- Modal for adding/viewing notes -->
				<div id="modalOverlay"></div>
				<div id="noteModal">
					<h3 id="modalTitle">Add Note</h3>
					<input type="text" id="noteInput" placeholder="Enter your note here" />
					<button id="saveNoteButton">Save</button>
					<button id="cancelButton">Cancel</button>
				</div>
	
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
	
					let currentWord = null;
	
					document.querySelectorAll('.word').forEach(wordElement => {
						wordElement.addEventListener('click', () => {
							currentWord = wordElement.getAttribute('data-word');
							vscode.postMessage({ command: 'getNote', word: currentWord });
						});
					});
	
					window.addEventListener('message', event => {
						const message = event.data;
						if (message.command === 'showNote') {
							const noteInput = document.getElementById('noteInput');
							const modalTitle = document.getElementById('modalTitle');
							noteInput.value = message.note || '';
							modalTitle.textContent = 'Note for ' + message.word;
							showModal();
						}
					});
	
					document.getElementById('saveNoteButton').addEventListener('click', () => {
						const noteInput = document.getElementById('noteInput');
						vscode.postMessage({ command: 'addNote', word: currentWord, note: noteInput.value });
						hideModal();
					});
	
					document.getElementById('cancelButton').addEventListener('click', () => {
						hideModal();
					});
	
					function showModal() {
						document.getElementById('noteModal').style.display = 'block';
						document.getElementById('modalOverlay').style.display = 'block';
					}
	
					function hideModal() {
						document.getElementById('noteModal').style.display = 'none';
						document.getElementById('modalOverlay').style.display = 'none';
					}
				</script>
			</body>
			</html>
		`
	}
}

function getNonce() {
	let text = ''
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}

export function register(context: vscode.ExtensionContext) {
	return vscode.window.registerCustomEditorProvider(
		'wordNotesEditor',
		new WordNotesEditorProvider(context),
	)
}
