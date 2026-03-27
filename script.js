class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            // Prevent overly long numbers
            if (this.currentOperand.length >= 15) return;
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Handle floating point precision issues nicely
        computation = Math.round(computation * 100000000) / 100000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Add click listeners and visual feedback for buttons
function addClickInteraction(element, callback) {
    element.addEventListener('click', (e) => {
        element.style.transform = 'scale(0.92)';
        setTimeout(() => element.style.transform = '', 100);
        callback(e);
    });
}

numberButtons.forEach(button => {
    addClickInteraction(button, () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    addClickInteraction(button, (e) => {
        calculator.chooseOperation(e.target.innerText);
        calculator.updateDisplay();
    });
});

addClickInteraction(equalsButton, () => {
    calculator.compute();
    calculator.updateDisplay();
});

addClickInteraction(clearButton, () => {
    calculator.clear();
    calculator.updateDisplay();
});

addClickInteraction(deleteButton, () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    let patternForNumbers = /[0-9]/g;
    let patternForOperators = /[+\-*\/]/g;
    
    if (event.key.match(patternForNumbers) || event.key === '.') {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    
    if (event.key.match(patternForOperators)) {
        event.preventDefault();
        let op = event.key;
        if (op === '/') op = '÷';
        if (op === '*') op = '×';
        if (op === '-') op = '−';
        calculator.chooseOperation(op);
        calculator.updateDisplay();
    }
    
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    
    if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
        calculator.updateDisplay();
    }
    
    if (event.key === 'Escape') {
        event.preventDefault();
        calculator.clear();
        calculator.updateDisplay();
    }
});
