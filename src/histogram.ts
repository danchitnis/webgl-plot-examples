

import * as noUiSlider from "nouislider";

import { ColorRGBA, WebGLplot, WebglStep} from "webgl-plot";

import Statsjs = require("stats.js");



const uNoise = 1;
let randXSize = 10;


const canv =  document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;
// let num = Math.round(canv.clientWidth * devicePixelRatio);

const yScale = 1;

const fpsDivder = 1;
let fpsCounter = 0;


let wglp: WebGLplot;
let line: WebglStep;

const randXSizeList = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

let sliderYNoise: noUiSlider.Instance;

let displayYNoise: HTMLSpanElement;

const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );

const numBins = 100;

createUI();

init();

let X: Float32Array;

// console.log(X);

const xbins = new Float32Array(numBins);
for (let i = 0; i < xbins.length; i++) {
  xbins[i] = 0;

}

/*for (let i = 0; i < X.length; i++) {
  const bin = Math.floor(X[i]);
  xbins[bin]++;
}*/

console.log(xbins);


/*for (let i = 0; i < xbins.length; i++) {
  line.setY(i, xbins[i] / randXSize);
}*/

wglp.update();



let resizeId: number;
window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});



function new_frame() {


  if (fpsCounter === 0) {

    stats.begin();

    X = new Float32Array(randXSize);
    randn_array(X);

    for (let i = 0; i < xbins.length; i++) {
      xbins[i] = 0;

    }

    for (let i = 0; i < X.length; i++) {
      const bin = Math.floor(X[i]);
      xbins[bin]++;
    }
    // Normalize ?
    for (let i = 0; i < xbins.length; i++) {
      line.setY(i, (xbins[i] / randXSize) * 10);
    }
    wglp.update();

    stats.end();

  }

  fpsCounter++;

  if (fpsCounter >= fpsDivder) {
    fpsCounter = 0;
  }

  window.requestAnimationFrame(new_frame);
}

window.requestAnimationFrame(new_frame);



function init() {
  wglp = new WebGLplot(canv);


  const color = new ColorRGBA(1, 1, 0, 0.5);
  line = new WebglStep(color, numBins);
  line.linespaceX();
  wglp.add_line(line);

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
    array[i] = randn_bm(0, numBins, 1);
  }
}







function doneResizing() {
  wglp.viewport(0, 0, canv.width, canv.height);
  console.log(window.innerWidth);
}



function createUI() {
  const ui =  document.getElementById("ui") as HTMLDivElement;

  // ******slider lines */
  sliderYNoise =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderYNoise.style.width = "100%";
  noUiSlider.create(sliderYNoise, {
    start: [3],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: randXSizeList.length - 1,
    },
  });

  displayYNoise = document.createElement("span");
  ui.appendChild(sliderYNoise);
  ui.appendChild(displayYNoise);
  ui.appendChild(document.createElement("p"));

  sliderYNoise.noUiSlider.on("update", (values, handle) => {
    randXSize = randXSizeList[parseFloat(values[handle])];
    displayYNoise.innerHTML = `Line number: ${randXSize}`;
  });

  sliderYNoise.noUiSlider.on("set", (values, handle) => {
    init();
  });


}
