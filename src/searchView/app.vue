<template>
	<div class="flex flex-col max-h-full gap-2">
		<div>
			<input
				v-model="prefix"
				type="text"
				class="text-input-foreground bg-input-background placeholder:text-input-placeholderForeground border-none focus:border-focusBorder px-2 py-1"
				@input="handleInput"
			/>
		</div>
		<ul class="p-0 m-0 grow overflow-auto">
			<li
				v-for="(word, index) in matches"
				:key="index"
				class="list-none hover:bg-list-hoverBackground m-0 cursor-pointer px-2 py-1"
				@click="handleClick(word)"
			>
				{{ word }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const vscode = acquireVsCodeApi()
const prefix = ref('')
const matches = ref<string[]>()
function handleInput() {
	vscode.postMessage({
		command: 'searchByPrefix',
		prefix: prefix.value,
	})
}
function handleClick(word: string) {
	vscode.postMessage({
		command: 'setWord',
		word: word,
	})
}
window.addEventListener('message', (e) => {
	matches.value = e.data.matches
	if (e.data.input) {
		prefix.value = e.data.input
	}
})
</script>
