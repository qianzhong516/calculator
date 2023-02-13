// A calculator that mimics the built-in calculator on Iphone device

type Operation = '+' | '-' | 'x' | '/';

const operationPrecedenceMap: Record<Operation, number> = {
    ['x']: 0,
	['/']: 0,
	['+']: 1,
	['-']: 1,
};

class Calculator {
	history: (Operation | number)[];
	resultToDisplay: number | undefined;

	get result() {
		return this.resultToDisplay;
	}

	addInput(value: number, operation: Operation) {
		this.history.push(value, operation);
	}

	traverseLeft(currPos: number) {
		const leftPos = currPos - 3;
		const midPos = currPos - 2;
		const rightPos = currPos - 1;

		if (this.history[leftPos] == null) {
			return;
		}

		if (
			operationPrecedenceMap[this.history[midPos]] >
			operationPrecedenceMap[this.history[currPos]]
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
        this.history.splice(leftPos, 3, result);
        this.traverseLeft(currPos);
	}

	calculate(operation: Operation, x: number, y: number) {
		switch (operation) {
			case '+':
				return x + y;
			case '-':
				return x - y;
			case 'x':
				return x * y;
			case '/':
				return x / y;
			default:
				throw new Error('Such operation does not exist!')
		}
	}
}
