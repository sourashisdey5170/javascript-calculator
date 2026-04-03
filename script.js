// ------------------ Calculator Logic ------------------ //
let memory = 0;
let display = document.getElementById("display");

function clearDisplay() {
  display.innerText = "0";
  scrollDisplayRight();
}

function append(value) {
  if (value === "MC") {
    memory = 0;
  } else if (value === "M+") {
    memory += parseFloat(display.innerText) || 0;
  } else if (value === "M-") {
    memory -= parseFloat(display.innerText) || 0;
  } else if (value === "C") {
    display.innerText = "0";
  } else {
    if (display.innerText === "0" && !isNaN(value)) {
      display.innerText = value;
    } else {
      display.innerText += value;
    }
  }
  scrollDisplayRight();  // Keep last number visible
}

function calculate() {
  try {
    let expression = display.innerText
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/−/g, "-");
    let result = eval(expression);
    addToHistory(display.innerText + " = " + result);
    display.innerText = result;
  } catch (error) {
    display.innerText = "Error";
  }
  scrollDisplayRight();  // Keep last number visible
}

function backspace() {
  if (display.innerText.length === 1) {
    display.innerText = "0";
  } else {
    display.innerText = display.innerText.slice(0, -1);
  }
  scrollDisplayRight();  // Keep last number visible
}

// ------------------ Keep display scrolled to right ------------------ //
function scrollDisplayRight() {
  display.scrollLeft = display.scrollWidth;
}

// ------------------ History Panel ------------------ //
const toggleBtn = document.getElementById("stickyToggleBtn");
const historyContainer = document.getElementById("historyContainer");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");

toggleBtn.addEventListener("click", () => {
  historyContainer.classList.toggle("collapsed");
});

closeHistoryBtn.addEventListener("click", () => {
  historyContainer.classList.add("collapsed");
});

function addToHistory(entry) {
  const historyList = document.getElementById("historyList");
  const li = document.createElement("li");
  li.innerText = entry;
  historyList.prepend(li);
}

// ------------------ Helper Function ------------------ //
function formatResult(value) {
  value = Math.round((value + Number.EPSILON) * 1000000000) / 1000000000;

  if (Number.isInteger(value)) {
    return value.toString();
  } else {
    return parseFloat(value.toFixed(2));
  }
}

// ------------------ Unit Converter ------------------ //
const units = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 },
  weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
  temperature: { C: "C", F: "F", K: "K" },
};

function populateUnits() {
  const unitType = document.getElementById("unitType").value;
  const from = document.getElementById("fromUnit");
  const to = document.getElementById("toUnit");

  from.innerHTML = "";
  to.innerHTML = "";

  if (unitType === "temperature") {
    ["C", "F", "K"].forEach((unit) => {
      from.innerHTML += `<option value="${unit}">${unit}</option>`;
      to.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  } else {
    Object.keys(units[unitType]).forEach((unit) => {
      from.innerHTML += `<option value="${unit}">${unit}</option>`;
      to.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  }
}

function convertUnit() {
  const unitType = document.getElementById("unitType").value;
  const input = parseFloat(document.getElementById("unitInput").value);
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;

  if (isNaN(input)) {
    document.getElementById("unitOutput").value = "Invalid input";
    return;
  }

  let result;
  if (unitType === "temperature") {
    if (from === to) {
      result = input;
    } else if (from === "C") {
      result = to === "F" ? (input * 9) / 5 + 32 : input + 273.15;
    } else if (from === "F") {
      result = to === "C" ? ((input - 32) * 5) / 9 : ((input - 32) * 5) / 9 + 273.15;
    } else if (from === "K") {
      result = to === "C" ? input - 273.15 : ((input - 273.15) * 9) / 5 + 32;
    }
  } else {
    const base = input * units[unitType][from];
    result = base / units[unitType][to];
  }

  document.getElementById("unitOutput").value = formatResult(result);
}

// ------------------ Currency Converter ------------------ //
const currencyRates = {
  INR: { USD: 0.012, EUR: 0.011 },
  USD: { INR: 83.0, EUR: 0.91 },
  EUR: { INR: 91.0, USD: 1.10 },
};

function convertCurrency() {
  const amount = parseFloat(document.getElementById("currencyInput").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  if (isNaN(amount)) {
    document.getElementById("currencyOutput").value = "Invalid input";
    return;
  }

  if (from === to) {
    document.getElementById("currencyOutput").value = formatResult(amount);
    return;
  }

  const rate = currencyRates[from][to];
  const converted = amount * rate;
  document.getElementById("currencyOutput").value = formatResult(converted);
}

// ------------------ Keyboard Support ------------------ //
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    append(key);
  } else if (key === ".") {
    append(".");
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    let op = key === "*" ? "×" : key === "/" ? "÷" : key;
    append(op);
  } else if (key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key.toUpperCase() === "C") {
    clearDisplay();
  }
});

window.onload = () => {
  populateUnits();
};

$("#stickyToggleBtn").click(function () {
  $("#historyContainer").toggle('slow');
});
