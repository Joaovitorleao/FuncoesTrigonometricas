const canvas = document.getElementById("trigCanvas");
const ctx = canvas.getContext("2d");
const functionSelector = document.getElementById("function");
const valueDisplay = document.getElementById("valueDisplay");

let time = 0;

function Fatorial(n) {
  if (n == 0 || n == 1) return 1;

  return n * Fatorial(n - 1);
}

function SenoTaylor(x, termos = 50) {
  let resultSin = 0;
  for (let n = 0; n < termos; n++) {
    const coeficienteSin = Math.pow(-1, n);
    const numeradorSin = Math.pow(x, 2 * n + 1);
    const denominadorSin = Fatorial(2 * n + 1);

    resultSin += (coeficienteSin * numeradorSin) / denominadorSin;
  }

  return resultSin;
}

function CossenoTaylor(x, termos = 50) {
  let resultCos = 0;
  for (let n = 0; n < termos; n++) {
    const coeficienteCos = Math.pow(-1, n);
    const numeradorCos = Math.pow(x, 2 * n);
    const denominadorCos = Fatorial(2 * n);

    resultCos += (coeficienteCos * numeradorCos) / denominadorCos;
  }

  return resultCos;
}

function TangenteTaylor(x, termos = 50) {
  return SenoTaylor(x, termos) / CossenoTaylor(x, termos);
}

function DesenhaGrid() {
  const gridSize = 50;

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  // Desenhar linhas verticais
  for (let x = gridSize; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Desenhar linhas horizontais
  for (let y = gridSize; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function DesenhaEixos() {
  ctx.lineWidth = 2;

  //Eixo x
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  //Eixo y
  ctx.beginPath();
  ctx.moveTo(canvas.height / 2, 0);
  ctx.lineTo(canvas.width / 4, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  //Rotula os eixos
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Y", canvas.Width / 2 + 10, 20);
  ctx.fillText("X", canvas.width - 20, canvas.height / 2 - 10);
}

function DesenhaFuncao(func, tempo) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  DesenhaGrid();
  DesenhaEixos();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x++) {
    const angle = (x / canvas.width) * 4 * Math.PI + time;
    let y;

    switch (func) {
      case "sin":
        y = SenoTaylor(angle);
        ctx.strokeStyle = "#00b";
        break;
      case "cos":
        y = CossenoTaylor(angle);
        ctx.strokeStyle = "#0b0";
        break;
      case "tan":
        y = TangenteTaylor(angle);
        ctx.strokeStyle = "#b00";
        break;
    }

    const yPos = canvas.height / 2 - y * 100;
    ctx.lineTo(x, yPos);
  }

  ctx.strokeStyle = "#000";
  ctx.stroke();
}

function Animacao() {
  const funcaoSelecionada = functionSelector.value;
  time += 0.05;
  DesenhaFuncao(funcaoSelecionada, time);
  requestAnimationFrame(Animacao);
}

Animacao(); // inicia a animação

functionSelector.addEventListener("change", () => {
  time = 0; //reseta o tempo
});

function displayValueAtX(x) {
  const angle = (x / canvas.width) * 4 * Math.PI + time;
  let sinValue = SenoTaylor(angle);
  let cosValue = CossenoTaylor(angle);
  let tanValue = TangenteTaylor(angle);

  valueDisplay.innerHTML = `x: ${x.toFixed(2)} | sin(x): ${sinValue.toFixed(
    4
  )} | cos(x): ${cosValue.toFixed(4)} | tan(x): ${tanValue.toFixed(4)}`;
}

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  displayValueAtX(mouseX);
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  displayValueAtX(mouseX);
});
