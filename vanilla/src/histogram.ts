import { WebglPlot, ColorRGBA, WebglStep } from "webgl-plot";
import { Slider } from "@spectrum-web-components/slider";
import { Button } from "@spectrum-web-components/button";

let randXSize = 10;
//let maxY = 0;
const xmin = 0;
const xmax = 100;
let numBins = 100;
let Xmin = 40;
let Xmax = 60;
let Xskew = 1;

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

let scaleY = 1;

let X: Float32Array;
let xbins: Float32Array;
let ybins: Float32Array;

let wglp: WebglPlot;
let line: WebglStep;

const randXSizeList = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const binSizeNumber = [2, 5, 10, 20, 50, 100, 200, 500, 1000];

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 500);
});

function newFrame(): void {
  update();
  wglp.gScaleY = scaleY;
  wglp.update();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

function init(): void {
  wglp = new WebglPlot(canvas);
  xbins = new Float32Array(numBins);
  ybins = new Float32Array(numBins);

  wglp.gOffsetY = -1;
  wglp.gOffsetX = -1;
  wglp.gScaleX = 2 / numBins;

  for (let i = 0; i < xbins.length; i++) {
    xbins[i] = (i * (xmax - xmin)) / numBins + xmin;
  }

  const color = new ColorRGBA(1, 1, 0, 1);
  line = new WebglStep(color, numBins);
  // line.linespaceX(-1, 2 / numBins);
  // instead of line above we are applying offsetX and scaleX
  line.lineSpaceX(0, 1);
  wglp.addLine(line);
}

function update(): void {
  X = new Float32Array(randXSize);
  randnArray(X);

  for (let i = 0; i < ybins.length; i++) {
    ybins[i] = 0;
  }

  for (let i = 0; i < X.length; i++) {
    const bin = X[i];

    if (bin < xmin) {
      ybins[0]++;
    } else {
      if (bin > xmax) {
        ybins[numBins - 1]++;
      } else {
        const index = (numBins * (bin - xmin)) / (xmax - xmin);
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
function randnBM(min: number, max: number, skew: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = Math.random();
  } // Converting [0,1) to (0,1)
  while (v === 0) {
    v = Math.random();
  }
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randnBM(min, max, skew);
  } // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

function randnArray(array: Float32Array): void {
  for (let i = 0; i < array.length; i++) {
    array[i] = randnBM(Xmin, Xmax, Xskew);
  }
}

function doneResizing(): void {
  //wglp.viewport(0, 0, canv.width, canv.height);
}

function createUI(): void {
  const sliderXsize = document.getElementById("sliderXsize") as Slider;

  sliderXsize.addEventListener("input", (event: Event) => {
    const slider = event.target as Slider;
    randXSize = randXSizeList[slider.value];
  });
  sliderXsize.addEventListener("change", (event: Event) => {
    init();
  });

  sliderXsize.getAriaValueText = () => {
    return randXSize.toString();
  };

  const sliderXrange = document.getElementById("sliderXrange") as Slider;

  sliderXrange.addEventListener("input", (event: Event) => {
    const slider = event.target as Slider;
    Xmin = slider.name === "min" ? slider.value : Xmin;
    Xmax = slider.name === "max" ? slider.value : Xmax;
  });

  const sliderYscale = document.getElementById("sliderYscale") as Slider;

  sliderYscale.addEventListener("input", (event: Event) => {
    const slider = event.target as Slider;
    scaleY = slider.value;
  });

  const sliderBinNumber = document.getElementById("sliderBinNumber") as Slider;

  sliderBinNumber.addEventListener("input", (event: Event) => {
    const slider = event.target as Slider;
    numBins = binSizeNumber[slider.value];
    init();
  });

  sliderBinNumber.getAriaValueText = () => {
    return numBins.toString();
  };

  const sliderSkew = document.getElementById("sliderSkew") as Slider;

  sliderSkew.addEventListener("input", (event: Event) => {
    const slider = event.target as Slider;
    Xskew = slider.value;
  });
}
