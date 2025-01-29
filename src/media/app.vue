<template>
	<h2 class="text-xl">Vue</h2>
	<p>{{ count }}</p>
	<button @click="increment">Increment</button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
function increment() {
	count.value++
}
</script>
