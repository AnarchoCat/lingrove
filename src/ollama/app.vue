<template>
	<div class="h-full flex flex-col gap-4 py-4 px-2">
		<div class="flex">
			<select
				id="model"
				v-model="currentModel"
				name="model"
				class="bg-input-background text-input-foreground focus:border-focusBorder px-2 py-1 grow"
			>
				<option v-for="model in models" :key="model.model" :value="model.model">
					{{ model.name }}
				</option>
			</select>
			<button
				class="text-button-foreground bg-button-background hover:bg-button-hoverBackground border-none flex justify-center items-center p-1 cursor-pointer"
				@click="getModelList"
			>
				<i class="codicon codicon-refresh"></i>
			</button>
		</div>
		<!-- messages -->
		<div class="overflow-auto grow">
			<div
				v-for="(message, index) in messages"
				:key="index"
				class="rounded py-2"
				:class="{
					'bg-terminal-ansiBlue': message.role === 'user',
					'ml-4': message.role === 'user',
					'px-2': message.role === 'user',
				}"
			>
				{{ message.content }}
			</div>
		</div>
		<!-- /messages -->
		<div class="flex flex-col gap-2">
			<textarea
				v-model="messageToSend"
				class="bg-input-background text-input-foreground focus:border-focusBorder border-none px-2 py-1"
				@keydown="handleKeydown"
			></textarea>
			<div class="flex flex-col md:flex-row gap-2 md:justify-end">
				<button
					type="button"
					class="text-button-foreground bg-button-background hover:bg-button-hoverBackground cursor-pointer border-none px-2 py-1"
					@click="send"
				>
					Send
				</button>
				<button
					type="button"
					class="text-button-secondaryForeground bg-button-secondaryBackground hover:bg-button-secondaryHoverBackground cursor-pointer border-none px-2 py-1"
					@click="clear"
				>
					Clear
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import '@vscode/codicons/dist/codicon.ttf'
import type { Message, ModelResponse } from 'ollama'
const vscode = acquireVsCodeApi()
// Model list
const models = ref<ModelResponse[]>()
// Current selected model name
const _currentModel = ref('')
const currentModel = computed({
	get() {
		return _currentModel.value
	},
	set(newValue) {
		vscode.postMessage({
			command: 'setModel',
			model: newValue,
		})
		clear()
		_currentModel.value = newValue
	},
})
// Message to send
const messageToSend = ref<string>('')
// Chat history messages
const messages = ref<Message[]>([])
// Whether is Mac OS
let isMac = false

// Get local model list
function getModelList() {
	vscode.postMessage({
		command: 'list',
	})
}

// Handle keydown event in input textarea
function handleKeydown(e: KeyboardEvent) {
	if (
		(isMac && e.metaKey && e.key === 'Enter') || // Command + Enter on macOS
		(!isMac && e.ctrlKey && e.key === 'Enter') // Ctrl + Enter on other OS
	) {
		e.preventDefault()
		send()
	}
}

// Send chat message
function send() {
	vscode.postMessage({
		command: 'chat',
		message: messageToSend.value,
	})
	messages.value.push({
		role: 'user',
		content: messageToSend.value,
	})
	messageToSend.value = ''
}

// Clear chat history
function clear() {
	messages.value = []
	vscode.postMessage({
		command: 'clear',
	})
}

window.addEventListener('message', (e) => {
	if (e.data.message === 'list') {
		models.value = e.data.models
		if (models.value && models.value.length > 0) {
			currentModel.value = models.value[0].model
		}
	} else if (e.data.message === 'chat') {
		if (e.data.isFirstPart) {
			messages.value.push({
				role: e.data.role,
				content: e.data.content,
			})
		} else {
			messages.value[messages.value.length - 1].content += e.data.content
		}
	}
})
onMounted(() => {
	getModelList()
	isMac = navigator.userAgent.toLowerCase().includes('mac')
})
</script>

<style lang="postcss">
@import '@assets/tailwind.css';
@import '@vscode/codicons/dist/codicon.css';
@source 'app.vue';
@source 'index.html';
</style>
