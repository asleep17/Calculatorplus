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

function addFunction(name) {
    // Insert implicit multiplication if function follows a number or closing parenthesis
    if (expression && /[0-9)]$/.test(expression)) {
        expression += "*";
    }
    expression += name + "(";
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
        // Evaluate a safe subset: digits, operators, decimal points, limited function names
        // Allowed function name characters: s, c, i, n, t, a, g, o, l (sin, cos, tan, log)
        if (!/^[0-9+\-*/.()scintagol ]+$/.test(expression)) {
            throw new Error("Invalid characters");
        }

        // Auto-close any missing closing parentheses to make function input friendlier
        let toEval = expression;
        const openCount = (toEval.match(/\(/g) || []).length;
        const closeCount = (toEval.match(/\)/g) || []).length;
        if (closeCount < openCount) {
            toEval += ")".repeat(openCount - closeCount);
        }

        // Map simple function names to Math.* equivalents
        toEval = toEval.replace(/sin\(/g, "Math.sin(");
        toEval = toEval.replace(/cos\(/g, "Math.cos(");
        toEval = toEval.replace(/tan\(/g, "Math.tan(");
        // log = base‑10 logarithm
        toEval = toEval.replace(/log\(/g, "Math.log10(");

        // Use Function constructor instead of eval but still only on validated input
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${toEval})`)();

        lastResult = Number.isFinite(result) ? String(result) : "Error";
    } catch {
        lastResult = "Error";
    }
    updateDisplay();
}

// Initial paint
updateDisplay();


