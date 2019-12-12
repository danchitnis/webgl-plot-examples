

import * as noUiSlider from "nouislider";

import { ColorRGBA, WebGLplot, WebglStep} from "webgl-plot";

import Statsjs = require("stats.js");



let randXSize = 10;
let maxY = 0;
const xmin = 0;
const xmax = 100;
let numBins = 100;
let Xmin = 25;
let Xmax = 75;
let Xskew = 1;


const canv =  document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;


let scaleY = 1;


let X: Float32Array;
let xbins: Float32Array;
let ybins: Float32Array;

let wglp: WebGLplot;
let line: WebglStep;

const randXSizeList = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const binSizeNumber = [2, 5, 10, 20, 50, 100, 200, 500, 1000];

let sliderXsize: noUiSlider.Instance;
let sliderXrange: noUiSlider.Instance;
let sliderYScale: noUiSlider.Instance;
let sliderBinNum: noUiSlider.Instance;
let sliderSkew: noUiSlider.Instance;

let displayXsize: HTMLSpanElement;
let displayXrange: HTMLSpanElement;
let displayYScale: HTMLSpanElement;
let displayBinNum: HTMLSpanElement;
let displaySkew: HTMLSpanElement;

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



function new_frame() {

  stats.begin();

  update();
  wglp.scaleY = scaleY;
  wglp.update();

  stats.end();



  window.requestAnimationFrame(new_frame);
}

window.requestAnimationFrame(new_frame);



function init() {
  wglp = new WebGLplot(canv, new ColorRGBA(0.1, 0.1, 0.1, 1));
  xbins = new Float32Array(numBins);
  ybins = new Float32Array(numBins);

  wglp.offsetY = -1;
  wglp.offsetX = -1;
  wglp.scaleX = 2 / numBins;

  for (let i = 0; i < xbins.length; i++) {
    xbins[i] = i * (xmax - xmin) / numBins + xmin;
  }

  const color = new ColorRGBA(1, 1, 0, 0.5);
  line = new WebglStep(color, numBins);
  // line.linespaceX(-1, 2 / numBins);
  // instead of line above we are applying offsetX and scaleX
  line.linespaceX(0, 1);
  wglp.add_line(line);
}



function update() {

  X = new Float32Array(randXSize);
  randn_array(X);

  for (let i = 0; i < ybins.length; i++) {
    ybins[i] = 0;
  }

  for (let i = 0; i < X.length; i++) {
    const bin = (X[i]);

    if (bin < xmin) {
      ybins[0]++;
    } else {
      if (bin > xmax) {
        ybins[numBins-1]++;
      } else {
        const index = numBins * (bin - xmin) / (xmax - xmin);
        ybins[Math.floor(index)]++;
      }

    }
  }

  // Normalize ?
  for (let i = 0; i < ybins.length; i++) {
    const y = (ybins[i] / randXSize) * numBins;
    line.setY(i, y * 0.02);
  }
}




/** https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve */
function randn_bm(min: number, max: number, skew: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) { u = Math.random(); } // Converting [0,1) to (0,1)
  while (v === 0) { v = Math.random(); }
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) { num = randn_bm(min, max, skew); } // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}


function randn_array(array: Float32Array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = randn_bm(Xmin, Xmax, Xskew);
  }
}







function doneResizing() {
  wglp.viewport(0, 0, canv.width, canv.height);
}



function createUI() {
  const ui =  document.getElementById("ui") as HTMLDivElement;

  // ******slider X size */
  sliderXsize =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderXsize.style.width = "100%";
  noUiSlider.create(sliderXsize, {
    start: [3],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: randXSizeList.length - 1,
    },
  });

  displayXsize = document.createElement("span");
  ui.appendChild(sliderXsize);
  ui.appendChild(displayXsize);
  ui.appendChild(document.createElement("p"));

  sliderXsize.noUiSlider.on("update", (values, handle) => {
    randXSize = randXSizeList[parseFloat(values[handle])];
    displayXsize.innerHTML = `X random size: ${randXSize}`;
  });

  sliderXsize.noUiSlider.on("set", (values, handle) => {
    init();
  });


  // ************ slider X range
  sliderXrange =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderXrange.style.width = "100%";
  noUiSlider.create(sliderXrange, {
    start: [40, 60],
    connect: true,
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 100,
    },
  });

  displayXrange = document.createElement("span");
  ui.appendChild(sliderXrange);
  ui.appendChild(displayXrange);
  ui.appendChild(document.createElement("p"));

  sliderXrange.noUiSlider.on("update", (values, handle) => {
    Xmin = parseFloat(values[0]);
    Xmax = parseFloat(values[1]);
    displayXrange.innerHTML = `X range is between ${Xmin} and ${Xmax}`;
  });


  // ******slider Y Scale */
  sliderYScale =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderYScale.style.width = "100%";
  noUiSlider.create(sliderYScale, {
    start: [1],
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 10,
    },
  });

  displayYScale = document.createElement("span");
  ui.appendChild(sliderYScale);
  ui.appendChild(displayYScale);
  ui.appendChild(document.createElement("p"));

  sliderYScale.noUiSlider.on("update", (values, handle) => {
    scaleY = parseFloat(values[handle]);
    displayYScale.innerHTML = `Y scale = ${scaleY}`;
  });


  // ******slider Bin size */
  sliderBinNum =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderBinNum.style.width = "100%";
  noUiSlider.create(sliderBinNum, {
    start: [5],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: binSizeNumber.length - 1,
    },
  });

  displayBinNum = document.createElement("span");
  ui.appendChild(sliderBinNum);
  ui.appendChild(displayBinNum);
  ui.appendChild(document.createElement("p"));

  sliderBinNum.noUiSlider.on("update", (values, handle) => {
    displayBinNum.innerHTML = `Number of bins = ${binSizeNumber[parseFloat(values[handle])]}`;
  });

  sliderBinNum.noUiSlider.on("set", (values, handle) => {
    numBins = binSizeNumber[parseFloat(values[handle])];
    init();
  });


  // ******slider skew */
  sliderSkew =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderSkew.style.width = "100%";
  noUiSlider.create(sliderSkew, {
    start: [1],
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.1,
      max: 10,
    },
  });

  displaySkew = document.createElement("span");
  ui.appendChild(sliderSkew);
  ui.appendChild(displaySkew);
  ui.appendChild(document.createElement("p"));

  sliderSkew.noUiSlider.on("update", (values, handle) => {
    Xskew = parseFloat(values[handle]);
    displaySkew.innerHTML = `Skew is = ${Xskew}`;
  });




}
