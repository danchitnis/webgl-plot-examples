

import * as noUiSlider from "nouislider";
import { ColorRGBA, WebglLine, WebGLplot} from "./webglplot/webglplot";

import Statsjs = require("stats.js");



let numLines = 1;

let amp = 0.5;
let noise  = 0.1;
let freq = 0.01;


const canv =  document.getElementById("my_canvas") as HTMLCanvasElement;



let numX: number;



const scaleY = 1;


let wglp: WebGLplot;
let lines: WebglLine[];

const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let sliderLines: noUiSlider.Instance;
let sliderFreq: noUiSlider.Instance;
let sliderAmp: noUiSlider.Instance;
let sliderNoise: noUiSlider.Instance;

let displayLines: HTMLSpanElement;
let displayFreq: HTMLSpanElement;
let displayAmp: HTMLSpanElement;
let displayNoise: HTMLSpanElement;

const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );

createUI();

init();


let resizeId: number;
window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});



function newFrame(): void {

  stats.begin();

  update();

  wglp.update();
  wglp.scaleY = scaleY;

  stats.end();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);



function init(): void {

  const devicePixelRatio = window.devicePixelRatio || 1;
  numX = Math.round(canv.clientWidth * devicePixelRatio);


  lines = [];

  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    lines.push(new WebglLine(color, numX));
  }

  wglp = new WebGLplot(canv, new ColorRGBA(0.1, 0.1, 0.1, 1));

  // wglp.offsetX = -1;
  // wglp.scaleX = 2;


  lines.forEach((line) => {
    line.linespaceX(-1, 2  / numX);
    wglp.addLine(line);
  });
}

function update(): void {

  for (let j = 0; j < lines.length; j++) {
    for (let i = 0; i < lines[j].numPoints; i++) {
      const ySin = Math.sin(Math.PI * i * freq + (j  / lines.length) * Math.PI * 2);
      const yNoise = Math.random() - 0.5;
      lines[j].setY(i,  ySin * amp + yNoise * noise);
    }
  }
}


function doneResizing(): void {
  wglp.viewport(0, 0, canv.width, canv.height);
}



function createUI(): void {
  const ui =  document.getElementById("ui") as HTMLDivElement;

  // ******slider lines */
  sliderLines =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderLines.style.width = "100%";
  noUiSlider.create(sliderLines, {
    start: [0],
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
    numLines = lineNumList[parseFloat(values[handle])];
    displayLines.innerHTML = `Line number: ${numLines}`;
  });

  sliderLines.noUiSlider.on("set", () => {
    init();
  });


  // ******slider Freq */
  sliderFreq =  document.createElement("div") as unknown as noUiSlider.Instance;
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
    const k = 0.01;
    freq = k * parseFloat(values[handle]);
    displayFreq.innerHTML = `Frequency: ${freq / k}`;
  });


  // ******slider amp */
  sliderAmp =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderAmp.style.width = "100%";
  noUiSlider.create(sliderAmp, {
    start: [1],
    step: 0.001,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 2,
    },
  });

  displayAmp = document.createElement("span");
  ui.appendChild(sliderAmp);
  ui.appendChild(displayAmp);
  ui.appendChild(document.createElement("p"));

  sliderAmp.noUiSlider.on("update", (values, handle) => {
    const k = 0.5;
    amp = k * parseFloat(values[handle]);
    displayAmp.innerHTML = `Signal Amplitude: ${amp / k}`;
  });



  // ******slider noise */
  sliderNoise =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderNoise.style.width = "100%";
  noUiSlider.create(sliderNoise, {
    start: [1],
    step: 0.001,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 5,
    },
  });

  displayNoise = document.createElement("span");
  ui.appendChild(sliderNoise);
  ui.appendChild(displayNoise);
  ui.appendChild(document.createElement("p"));

  sliderNoise.noUiSlider.on("update", (values, handle) => {
    const k = 0.1;
    noise = k * parseFloat(values[handle]);
    displayNoise.innerHTML = `Signal Amplitude: ${noise / k}`;
  });

}
