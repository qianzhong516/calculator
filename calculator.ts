// A calculator that mimics the built-in calculator on Iphone device

type Operation = '+' | '-' | '*' | '÷';

const operationPrecedenceMap: Record<Operation, number> = {
	['*']: 0,
	['÷']: 0,
	['+']: 1,
	['-']: 1,
};

class Calculator {
	history: (Operation | number)[] = [];
	historyView: (Operation | number)[] = [];
	private resultToDisplay: number | undefined;

	get result() {
		return this.resultToDisplay;
	}

	get historyContent() {
		return this.historyView.join(' ');
	}

	changeOperation(operation: Operation) {
		this.history.pop();
		this.history.push(operation);
		this.historyView.pop();
		this.historyView.push(operation);
	}

	addInput(value: number, operation: Operation, isEqualBtnClicked = false) {
		this.history.push(value, operation);
		this.historyView.push(value, operation);
		this.traverseLeft(this.history.length - 1);
		if (isEqualBtnClicked) {
			this.history = [];
		}
	}

	reset() {
		this.history = [];
		this.historyView = [];
		this.resultToDisplay = undefined;
	}

	resetResult() {
		this.resultToDisplay = undefined;
	}

	// finds the next equation ready to be evaluated
	private traverseLeft(currPos: number) {
		const leftPos = currPos - 3;
		const midPos = currPos - 2;
		const rightPos = currPos - 1;

		if (this.history[leftPos] == null) {
			// exit if there is no equation needs to be evaluated anymore
			return;
		}

		if (
			operationPrecedenceMap[this.history[midPos] as Operation] >
			operationPrecedenceMap[this.history[currPos] as Operation]
		) {
			// exit if the previous operation's precedence is lower than the current one's
			return;
		}

		const result = this.calculate(
			this.history[midPos] as Operation,
			this.history[leftPos] as number,
			this.history[rightPos] as number
		);
		this.resultToDisplay = result;
		// replace the equation with the calculated result
		this.history.splice(leftPos, 3, result);
		this.traverseLeft(this.history.length - 1);
	}

	private calculate(operation: Operation, x: number, y: number) {
		switch (operation) {
			case '+':
				return x + y;
			case '-':
				return x - y;
			case '*':
				return x * y;
			case '÷':
				return x / y;
			default:
				throw new Error('Such operation does not exist!');
		}
	}
}

export const calculator = new Calculator();
