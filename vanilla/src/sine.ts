import { SimpleSlider } from "https://cdn.skypack.dev/@danchitnis/simple-slider";
import { WebglPlot, ColorRGBA, WebglLine } from "https://cdn.skypack.dev/webgl-plot";

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
  updateTextDisplay();
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
  const sliderLines = new SimpleSlider("sliderLine", 0, lineNumList.length - 1, lineNumList.length);
  sliderLines.setValue(0);
  sliderLines.callBackUpdate = () => {
    numLines = lineNumList[Math.round(sliderLines.value)];
    updateTextDisplay();
  };

  sliderLines.callBackDragEnd = () => {
    init();
  };

  const sliderFreq = new SimpleSlider("sliderFreq", 0, 0.03, 1001);
  sliderFreq.setValue(freq);
  sliderFreq.callBackUpdate = () => {
    freq = sliderFreq.value;
    updateTextDisplay();
  };

  const sliderAmp = new SimpleSlider("sliderAmp", 0, 1, 1001);
  sliderAmp.setValue(amp);
  sliderAmp.callBackUpdate = () => {
    amp = sliderAmp.value;
    updateTextDisplay();
  };

  const sliderNoise = new SimpleSlider("sliderNoise", 0, 0.5, 1001);
  sliderNoise.setValue(noise);
  sliderNoise.callBackUpdate = () => {
    noise = sliderNoise.value;
    updateTextDisplay();
  };

  const btView = document.getElementById("btView") as HTMLButtonElement;
  btView.addEventListener("click", () => {
    changeView();
  });
}

function updateTextDisplay() {
  document.getElementById("numLines").innerHTML = `Line number: ${numLines}`;
  document.getElementById("freq").innerHTML = `Freq = ${freq.toFixed(2)}`;
  document.getElementById("amp").innerHTML = `Amp = ${amp.toFixed(0)}`;
  document.getElementById("noise").innerHTML = `Noise = ${noise.toFixed(2)}`;
}
