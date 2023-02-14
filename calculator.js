// A calculator that mimics the built-in calculator on Iphone device
const operationPrecedenceMap = {
    ['*']: 0,
    ['/']: 0,
    ['+']: 1,
    ['-']: 1,
};
class Calculator {
    constructor() {
        this.history = [];
        this.historyView = [];
    }
    get result() {
        return this.resultToDisplay;
    }
    get historyContent() {
        return this.historyView.join(' ');
    }
    addInput(value, operation, isEqualBtnClicked = false) {
        this.history.push(value, operation);
        this.historyView.push(value, operation);
        this.traverseLeft(this.history.length - 1);
        if (isEqualBtnClicked) {
            this.history = [];
        }
    }
    clear() {
        this.history = [];
        this.historyView = [];
        this.resultToDisplay = undefined;
    }
    clearResult() {
        this.resultToDisplay = undefined;
    }
    // finds the next equation ready to be evaluated
    traverseLeft(currPos) {
        const leftPos = currPos - 3;
        const midPos = currPos - 2;
        const rightPos = currPos - 1;
        if (this.history[leftPos] == null) {
            // exit if there is no equation needs to be evaluated anymore
            return;
        }
        if (operationPrecedenceMap[this.history[midPos]] >
            operationPrecedenceMap[this.history[currPos]]) {
            // exit if the previous operation's precedence is lower than the current one's
            return;
        }
        const result = this.calculate(this.history[midPos], this.history[leftPos], this.history[rightPos]);
        this.resultToDisplay = result;
        // replace the equation with the calculated result
        this.history.splice(leftPos, 3, result);
        this.traverseLeft(this.history.length - 1);
    }
    calculate(operation, x, y) {
        switch (operation) {
            case '+':
                return x + y;
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                return x / y;
            default:
                throw new Error('Such operation does not exist!');
        }
    }
}
export const calculator = new Calculator();
