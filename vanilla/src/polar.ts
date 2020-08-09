import * as noUiSlider from "nouislider";

import WebGLplot, { ColorRGBA, WebglPolar } from "webgl-plot";

import * as Statsjs from "stats.js";

let amp = 0.5;
let noise = 0.1;
let freq = 0.01;

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

let numPoints = 100;

let wglp: WebGLplot;
let line: WebglPolar;

const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let sliderLines: noUiSlider.Instance;
let sliderFreq: noUiSlider.Instance;
let sliderRotation: noUiSlider.Instance;

let displayLines: HTMLSpanElement;
let displayFreq: HTMLSpanElement;
let displayRotation: HTMLSpanElement;

const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 100);
});

function newFrame(): void {
  stats.begin();

  update();

  wglp.update();

  stats.end();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

function init(): void {
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const numX = canvas.width;
  const numY = canvas.height;

  const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
  line = new WebglPolar(color, numPoints);

  wglp = new WebGLplot(canvas);

  wglp.gScaleX = numY / numX;
  wglp.gScaleY = 1;

  wglp.addLine(line);
}

function update(): void {
  line.offsetTheta = 10 * noise;

  for (let i = 0; i < line.numPoints; i++) {
    const theta = (i * 360) / line.numPoints;
    const r = Math.cos((2 * Math.PI * freq * theta) / 360);

    line.setRtheta(i, theta, r);
  }
}

function doneResizing(): void {
  //wglp.viewport(0, 0, canv.width, canv.height);
  init();
}

function createUI(): void {
  const ui = document.getElementById("ui") as HTMLDivElement;

  // ******slider lines */
  sliderLines = (document.createElement("div") as unknown) as noUiSlider.Instance;
  sliderLines.style.width = "100%";
  noUiSlider.create(sliderLines, {
    start: [2],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 11,
    },
  });

  displayLines = document.createElement("span");
  ui.appendChild(sliderLines);
  ui.appendChild(displayLines);
  ui.appendChild(document.createElement("p"));

  sliderLines.noUiSlider.on("update", (values, handle) => {
    numPoints = lineNumList[parseFloat(values[handle])];
    displayLines.innerHTML = `Line number: ${numPoints}`;
  });

  sliderLines.noUiSlider.on("set", () => {
    init();
  });

  // ******slider Freq */
  sliderFreq = (document.createElement("div") as unknown) as noUiSlider.Instance;
  sliderFreq.style.width = "100%";
  noUiSlider.create(sliderFreq, {
    start: [1],
    step: 0.01,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 3,
    },
  });

  displayFreq = document.createElement("span");
  ui.appendChild(sliderFreq);
  ui.appendChild(displayFreq);
  ui.appendChild(document.createElement("p"));

  sliderFreq.noUiSlider.on("update", (values, handle) => {
    const k = 1;
    freq = k * parseFloat(values[handle]);
    displayFreq.innerHTML = `Frequency: ${freq / k}`;
  });

  // ******slider Rotation */
  sliderRotation = (document.createElement("div") as unknown) as noUiSlider.Instance;
  sliderRotation.style.width = "100%";
  noUiSlider.create(sliderRotation, {
    start: [1],
    step: 0.001,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 5,
    },
  });

  displayRotation = document.createElement("span");
  ui.appendChild(sliderRotation);
  ui.appendChild(displayRotation);
  ui.appendChild(document.createElement("p"));

  sliderRotation.noUiSlider.on("update", (values, handle) => {
    const k = 1;
    noise = k * parseFloat(values[handle]);
    displayRotation.innerHTML = `Rotation: ${noise / k}`;
  });
}
