<template>
	<div class="flex flex-col justify-center items-center gap-2 py-4">
		<p class="m-0">{{ word.length < 1 ? 'Nothing selected' : word }}</p>
		<textarea
			id="note"
			v-model="note"
			class="text-input-foreground bg-input-background placeholder:text-input-placeholderForeground w-full"
		></textarea>
		<button
			id="saveButton"
			type="button"
			class="text-button-foreground bg-button-background border border-transparent rounded-xs hover:bg-button-hoverBackground w-full max-w-90 cursor-pointer py-1"
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
