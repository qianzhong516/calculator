import { calculator } from './calculator.js';

let isOverwritten = true;
let screenContent = '';
let activeBtnIndex = undefined;

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

function setActiveBtnIndex(index) {
	activeBtnIndex = index;
	updateDOM();
}

function updateDOM() {
	screenDisplay.textContent = screenContent;
	historyView.innerHTML = `<p>${calculator.historyContent}</p>`;
	btns.forEach((btn) => btn.classList.remove('active'));
	if (activeBtnIndex !== undefined) {
		btns[activeBtnIndex].classList.add('active');
	}
}

const btns = document.querySelectorAll('.btn');
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
	setActiveBtnIndex(undefined);
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
		setActiveBtnIndex(Array.from(btns).indexOf(btn));
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
		setActiveBtnIndex(Array.from(btns).indexOf(btn));
		/**
		 * below line is important to avoid bug in certain cases, for example,
		 * "6 * 3 + 2 - 3 * 2 - 1"
		 * it avoids rendering 20 again when user inputs "3 *"
		 */
		calculator.resetResult();
	})
);
