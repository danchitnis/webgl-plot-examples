import { WebglPlot, ColorRGBA, WebglLine } from "webgl-plot";
import { Slider } from "@spectrum-web-components/slider";
import { Button } from "@spectrum-web-components/button";

let amp = 0.5;
let noise = 0.1;
let freq = 0.01;

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

const numX = Math.round(canvas.width);

const wglp = new WebglPlot(canvas);

let numLines = 1;
let segView = false;

const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 500);
});

function newFrame(): void {
  update();
  wglp.update();
  requestAnimationFrame(newFrame);
}

requestAnimationFrame(newFrame);

function init(): void {
  wglp.removeAllLines();
  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    const line = new WebglLine(color, numX);
    line.arrangeX();
    wglp.addLine(line);
  }
}

function update(): void {
  wglp.linesData.forEach((line, index) => {
    for (let i = 0; i < line.numPoints; i++) {
      const ySin = Math.sin(Math.PI * i * freq + (index / wglp.linesData.length) * Math.PI * 2);
      const yNoise = Math.random() - 0.5;
      (line as WebglLine).setY(i, ySin * amp + yNoise * noise);
    }
  });
}

function doneResizing(): void {
  //wglp.viewport(0, 0, canvas.width, canvas.height);
}

function changeView(): void {
  if (segView) {
    wglp.linesData.forEach((line) => {
      line.offsetY = 0;
      line.scaleY = 1;
    });
    segView = false;
  } else {
    wglp.linesData.forEach((line, index) => {
      line.offsetY = 1.5 * (index / wglp.linesData.length - 0.5);
      line.scaleY = 1.5 / wglp.linesData.length;
    });
    segView = true;
  }
}

function createUI(): void {
  const spsl1 = document.getElementById("sp-sl-1") as Slider;
  spsl1.addEventListener("input", (e: Event) => {
    const value = (e.target as Slider).value;
    numLines = lineNumList[value];
  });
  spsl1.addEventListener("change", (e: Event) => {
    init();
  });
  spsl1.getAriaValueText = () => {
    return `${numLines}`;
  };

  const spsl2 = document.getElementById("sp-sl-2") as Slider;
  spsl2.addEventListener("input", (e: Event) => {
    freq = (e.target as Slider).value;
  });

  const spsl3 = document.getElementById("sp-sl-3") as Slider;
  spsl3.addEventListener("input", (e: Event) => {
    amp = (e.target as Slider).value;
  });

  const spsl4 = document.getElementById("sp-sl-4") as Slider;
  spsl4.addEventListener("input", (e: Event) => {
    noise = (e.target as Slider).value;
  });

  const btView = document.getElementById("btView") as Button;
  btView.addEventListener("click", () => {
    changeView();
  });
}
