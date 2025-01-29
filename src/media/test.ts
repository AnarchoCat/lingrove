import './test.css'
import App from './app.vue'
import { createApp } from 'vue'
let count = 0
const counter = document.getElementById('lines-of-code-counter')!
const btn = document.querySelector('.btn')!
btn.addEventListener('click', function () {
	counter.textContent = (count++).toString()
})

const app = createApp(App)
app.mount('#app')
