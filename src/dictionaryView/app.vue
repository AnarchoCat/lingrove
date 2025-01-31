<template>
	<div>
		<h2>{{ word }}</h2>
		<textarea id="note" v-model="note"></textarea>
		<button
			id="saveButton"
			class="text-button-foreground bg-button-background border-button-border"
			@click="save"
		>
			Save
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const word = ref('')
const note = ref('')
const vscode = acquireVsCodeApi()
function save() {
	vscode.postMessage({
		command: 'saveNote',
		text: word.value,
		note: note.value,
	})
}
window.addEventListener('message', (e) => {
	word.value = e.data.word
	note.value = e.data.note
})
const html = document.querySelector('html')
console.log(html?.style)
</script>
