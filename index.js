import { calculator } from './calculator.js';

const btns = document.querySelectorAll('.btn.number');
const screenContent = document.querySelector('.screen .content');
const resetBtn = document.querySelector('.btn.reset');
const operationBtns = document.querySelectorAll('.btn.operation');
const equalBtn = document.querySelector('.btn.equal');
let overwrite = true;

for (let i = 0; i < btns.length; i++) {
	const btn = btns[i];
	btn.addEventListener('click', () => {
		const num = btn.textContent.trim();

		if (overwrite) {
			screenContent.textContent = num;
			overwrite = false;
		} else {
			screenContent.textContent += num;
		}

		if (screenContent.textContent.charAt(0) == 0) {
			screenContent.textContent = screenContent.textContent.substring(1);
		}
	});
}

resetBtn.addEventListener('click', () => {
	overwrite = true;
	screenContent.textContent = '0';
	calculator.clear();
});

for (let i = 0; i < operationBtns.length; i++) {
	const btn = operationBtns[i];
	btn.addEventListener('click', () => {
		overwrite = true;
		const operation = btn.textContent.trim();
		const num = Number(screenContent.textContent);
		calculator.addInput(num, operation);

		console.log('result: ', calculator.result);
		renderResult();
	});
}

equalBtn.addEventListener('click', () => {
	overwrite = true;
	const num = Number(screenContent.textContent);
	calculator.addInput(num, '=');
	renderResult();
});

function renderResult() {
	if (calculator.result) {
		screenContent.textContent = calculator.result;
		/**
		 * below line is important to avoid bug in certain cases, for example,
		 * "6 * 3 + 2 - 3 * 2 - 1"
		 * it avoids rendering 20 again when user inputs "3 *"
		 */
		calculator.clearResult();
	}
}
