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
