import { WebglPlot, ColorRGBA, WebglPolar } from "webgl-plot";
import { Slider } from "@spectrum-web-components/slider";

let rotation = 0.1;
let freq = 0.01;

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

const numPointList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
let numPoints = numPointList[9];

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const wglp = new WebglPlot(canvas);

let line: WebglPolar;

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 100);
});

function newFrame(): void {
  update();

  wglp.update();

  requestAnimationFrame(newFrame);
}

requestAnimationFrame(newFrame);

function init(): void {
  wglp.removeAllLines();

  const numX = canvas.width;
  const numY = canvas.height;

  const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
  line = new WebglPolar(color, numPoints);

  wglp.gScaleX = numY / numX;
  wglp.gScaleY = 1;

  wglp.addLine(line);
}

function update(): void {
  line.offsetTheta = 10 * rotation;

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
  const sliderLine = document.getElementById("sliderLine") as Slider;
  sliderLine.max = numPointList.length - 1;
  sliderLine.addEventListener("input", () => {
    numPoints = numPointList[sliderLine.value];
    init();
  });
  sliderLine.getAriaValueText = () => {
    return numPointList[sliderLine.value].toString();
  };

  const sliderFreq = document.getElementById("sliderFreq") as Slider;
  sliderFreq.addEventListener("input", () => {
    freq = sliderFreq.value;
  });

  const sliderRotation = document.getElementById("sliderRotation") as Slider;
  sliderRotation.addEventListener("input", () => {
    rotation = sliderRotation.value;
  });
}
