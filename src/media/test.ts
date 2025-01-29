import './test.css'
let count = 0
const counter = document.getElementById('lines-of-code-counter')!
const btn = document.querySelector('.btn')!
btn.addEventListener('click', function () {
	counter.textContent = (count++).toString()
})
