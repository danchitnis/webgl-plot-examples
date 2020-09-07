/**
 * Author Danial Chitnis 2019
 */

import { SimpleSlider } from "@danchitnis/simple-slider";
import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

const numX = Math.round(canvas.width);

const wglp = new WebGLplot(canvas);

let numLines = 1;
let scaleY = 1;
//let lines: WebglLine[];

let fpsDivder = 1;
let fpsCounter = 0;

// new data per frame
let newDataSize = 1;

const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

createUI();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 500);
});

/*let bt = <HTMLButtonElement>document.getElementById("bt");
bt.addEventListener("click",btclick);*/

init();

function newFrame(): void {
  if (fpsCounter === 0) {
    plot(newDataSize);

    wglp.gScaleY = scaleY;
    wglp.update();
  }

  fpsCounter++;

  if (fpsCounter >= fpsDivder) {
    fpsCounter = 0;
  }
  requestAnimationFrame(newFrame);
}

requestAnimationFrame(newFrame);

function plot(shiftSize: number): void {
  wglp.lines.forEach((line) => {
    const yArray = randomWalk((line as WebglLine).getY(numX - 1), shiftSize);
    (line as WebglLine).shiftAdd(yArray);
  });
}

function randomWalk(initial: number, walkSize: number): Float32Array {
  const y = new Float32Array(walkSize);
  y[0] = initial + 0.01 * (Math.round(Math.random()) - 0.5);
  for (let i = 1; i < walkSize; i++) {
    y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
  }
  return y;
}

function init(): void {
  wglp.removeAllLines();

  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    const line = new WebglLine(color, numX);
    line.lineSpaceX(-1, 2 / numX);
    wglp.addLine(line);
  }
}

function doneResizing(): void {
  //wglp.viewport(0, 0, canv.width, canv.height);
}

function createUI(): void {
  const sliderLines = new SimpleSlider("sliderLine", 0, lineNumList.length - 1, lineNumList.length);
  sliderLines.setValue(0);
  sliderLines.addEventListener("update", () => {
    numLines = lineNumList[Math.round(sliderLines.value)];
    updateTextDisplay();
  });
  sliderLines.addEventListener("drag-end", () => {
    init();
  });

  const sliderYSclae = new SimpleSlider("sliderYScale", 0, 2, 0);
  //sliderYSclae.setDebug(true);
  sliderYSclae.setValue(scaleY);
  sliderYSclae.addEventListener("update", () => {
    scaleY = sliderYSclae.value;
    updateTextDisplay();
  });

  const sliderNewData = new SimpleSlider("sliderNewData", 0, 100, 101);
  //sliderYSclae.setDebug(true);
  sliderNewData.setValue(newDataSize);
  sliderNewData.addEventListener("update", () => {
    newDataSize = sliderNewData.value;
    updateTextDisplay();
  });

  const sliderFps = new SimpleSlider("sliderFps", 1, 16, 16);
  //sliderYSclae.setDebug(true);
  sliderFps.setValue(newDataSize);
  sliderFps.addEventListener("update", () => {
    fpsDivder = sliderFps.value;
    updateTextDisplay();
  });

  updateTextDisplay();
}

function updateTextDisplay() {
  document.getElementById("numLines").innerHTML = `Line number: ${numLines}`;
  document.getElementById("yScale").innerHTML = `Y scale = ${scaleY.toFixed(2)}`;
  document.getElementById("newData").innerHTML = `New Data Size = ${newDataSize.toFixed(0)}`;
  document.getElementById("fps").innerHTML = `FPS = ${60 / fpsDivder}`;
}
