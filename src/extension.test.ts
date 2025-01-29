import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import './another.test'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.')

	test('Another test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5))
		assert.strictEqual(-1, [1, 2, 3].indexOf(0))
	})

	test('Check if extension is active', async () => {
		const extension = vscode.extensions.getExtension('AnarchoCat.mmimy')
		assert.ok(extension, 'Extension is not found')
		await extension?.activate()
		assert.strictEqual(extension?.isActive, true, 'Extension is not active')
	})
})
