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

function setIsOperationChanged(value) {
	if (value) {
		updateDOM();
	}
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

resetBtn.addEventListener('click', resetBtnHandler);
equalBtn.addEventListener('click', equalBtnHandler);
numBtns.forEach((btn) => {
	const value = btn.textContent.trim();
	const activeBtnIndex = Array.from(btns).indexOf(btn);
	btn.addEventListener('click', () => numBtnHandler(value, activeBtnIndex));
});
operationBtns.forEach((btn) => {
	const operation = btn.textContent.trim();
	const activeBtnIndex = Array.from(btns).indexOf(btn);
	btn.addEventListener('click', () =>
		operationBtnHandler(operation, activeBtnIndex)
	);
});

document.addEventListener('keypress', (e) => {
	const numReg = new RegExp(/[0-9.]/g);
	const operationReg = new RegExp(/[+\-*/]/g);

	if (e.key.match(numReg)) {
		const activeBtnIndex =
			e.key !== '.'
				? Array.from(btns).findIndex((btn) => btn.textContent === e.key)
				: undefined;
		numBtnHandler(e.key, activeBtnIndex);
		return;
	}

	if (e.key.match(operationReg)) {
		const key = e.key === '/' ? '÷' : e.key;
		const activeBtnIndex = Array.from(btns).findIndex(
			(btn) => btn.textContent === key
		);
		operationBtnHandler(key, activeBtnIndex);
		return;
	}

	if (e.key === 'Enter') {
		equalBtnHandler();
	}
});

function resetBtnHandler() {
	calculator.reset();
	setIsOverwritten(true);
	setScreenContent(0);
	setActiveBtnIndex(undefined);
}

function equalBtnHandler() {
	calculator.addInput(Number(screenContent), '=', true);
	setIsOverwritten(true);
	setScreenContent(calculator.result);
}

function numBtnHandler(value, activeBtnIndex) {
	activeBtnIndex !== undefined && setActiveBtnIndex(activeBtnIndex);
	setScreenContent(value);
	isOverwritten && setIsOverwritten(false);
}

function operationBtnHandler(operation, activeBtnIndex) {
	const isOperationActive = Array.from(operationBtns).some((btn) =>
		btn.classList.contains('active')
	);

	setActiveBtnIndex(activeBtnIndex);
	setIsOperationChanged(isOperationActive);
	setIsOverwritten(true);

	if (isOperationActive) {
		calculator.changeOperation(operation);
		return;
	}

	const num = Number(screenContent);

	calculator.addInput(num, operation);
	setScreenContent(calculator.result);
	/**
	 * below line is important to avoid bug in certain cases, for example,
	 * "6 * 3 + 2 - 3 * 2 - 1"
	 * it avoids rendering 20 again when user inputs "3 *"
	 */
	calculator.resetResult();
}
