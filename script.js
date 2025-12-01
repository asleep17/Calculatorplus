// Simple fx‑991ES‑style expression calculator

let expression = "";
let lastResult = "";

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

function updateDisplay() {
    expressionEl.textContent = expression || "0";
    resultEl.textContent = lastResult;
}

function addNumber(num) {
    expression += num;
    lastResult = "";
    updateDisplay();
}

function addOperator(op) {
    if (!expression) return;

    // Prevent two operators in a row
    const lastChar = expression.slice(-1);
    if ("+-*/".includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    lastResult = "";
    updateDisplay();
}

function addDecimal() {
    // Prevent multiple decimals in the current number segment
    const parts = expression.split(/[-+*/]/);
    const current = parts[parts.length - 1];
    if (current.includes(".")) return;

    if (!expression || "+-*/".includes(expression.slice(-1))) {
        expression += "0.";
    } else {
        expression += ".";
    }
    lastResult = "";
    updateDisplay();
}

function clearCalc() {
    expression = "";
    lastResult = "";
    updateDisplay();
}

function backspace() {
    if (!expression) return;
    expression = expression.slice(0, -1);
    lastResult = "";
    updateDisplay();
}

function calculate() {
    if (!expression) return;

    try {
        // Evaluate a safe subset: digits, operators, decimal points
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error("Invalid characters");
        }

        // Use Function constructor instead of eval but still only on validated input
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${expression})`)();

        lastResult = Number.isFinite(result) ? String(result) : "Error";
    } catch {
        lastResult = "Error";
    }
    updateDisplay();
}

// Initial paint
updateDisplay();


