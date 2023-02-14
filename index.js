import { calculator } from './calculator.js';

let isOverwritten = true;
let screenContent = '';

function setScreenContent(value) {
	if (value === undefined) {
		return;
	}

	if (isOverwritten) {
		screenContent = value;
	} else {
		screenContent += value;
	}

	if (screenContent.length > 1 && Number(screenContent.charAt(0)) === 0) {
		screenContent = screenContent.substring(1);
	}

	updateDOM();
}

function setIsOverwritten(value) {
	isOverwritten = value;
}

function updateDOM() {
	screenDisplay.textContent = screenContent;
	historyView.innerHTML = `<p>${calculator.historyContent}</p>`;
}

const numBtns = document.querySelectorAll('.btn.number');
const screenDisplay = document.querySelector('.screen .content');
const resetBtn = document.querySelector('.btn.reset');
const operationBtns = document.querySelectorAll('.btn.operation');
const equalBtn = document.querySelector('.btn.equal');
const historyView = document.getElementById('history-view');

resetBtn.addEventListener('click', () => {
	calculator.reset();
	setIsOverwritten(true);
	setScreenContent(0);
});

equalBtn.addEventListener('click', () => {
	calculator.addInput(Number(screenContent), '=', true);
	setIsOverwritten(true);
	setScreenContent(calculator.result);
});

numBtns.forEach((btn) =>
	btn.addEventListener('click', () => {
		const value = btn.textContent.trim();
		setScreenContent(value);
		isOverwritten && setIsOverwritten(false);
	})
);

operationBtns.forEach((btn) =>
	btn.addEventListener('click', () => {
		const operation = btn.textContent.trim();
		const num = Number(screenContent);
		calculator.addInput(num, operation);
		setIsOverwritten(true);
		setScreenContent(calculator.result);
		/**
		 * below line is important to avoid bug in certain cases, for example,
		 * "6 * 3 + 2 - 3 * 2 - 1"
		 * it avoids rendering 20 again when user inputs "3 *"
		 */
		calculator.resetResult();
	})
);
