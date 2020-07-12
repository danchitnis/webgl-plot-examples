import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";

const numLines = 1;

const amp = 0.5;
const noise = 0.1;
const freq = 0.01;

const canv = document.getElementById("my_canvas") as HTMLCanvasElement;

let numX: number;

let display: HTMLParagraphElement;

let wglp: WebGLplot;
let lines: WebglLine[];

let scale = 1;

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 500);
});

function newFrame(): void {
  update();

  wglp.update();
  //wglp.gScaleY = scaleY;

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

function init(): void {
  const devicePixelRatio = window.devicePixelRatio || 1;
  //numX = Math.round(canv.clientWidth * devicePixelRatio);
  numX = 1000000;

  lines = [];

  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    lines.push(new WebglLine(color, numX));
  }

  wglp = new WebGLplot(canv);

  // wglp.offsetX = -1;
  // wglp.scaleX = 2;

  lines.forEach((line) => {
    line.lineSpaceX(-1, 2 / numX);
    wglp.addLine(line);
  });

  for (let j = 0; j < lines.length; j++) {
    for (let i = 0; i < lines[j].numPoints; i++) {
      const ySin = Math.sin(Math.PI * i * freq + (j / lines.length) * Math.PI * 2);
      const yNoise = Math.random() - 0.5;
      lines[j].setY(i, ySin * amp + yNoise * noise);
    }
  }

  /*for (let j = 0; j < lines.length; j++) {
    for (let i = 1; i < lines[j].numPoints; i++) {
      let y = lines[j].getY(i - 1) + 0.1 * (Math.round(Math.random()) - 0.5);
      if (y > 1) {
        y = 0.9;
      }
      if (y < -1) {
        y = -0.9;
      }
      lines[j].setY(i, y);
    }
  }*/

  //wglp.viewport(0, 0, 1000, 1000);
  wglp.gScaleX = 1;

  canv.addEventListener("wheel", zoomEvent);
  //window.addEventListener("keydown", keyEvent);
}

function update(): void {
  if (wglp) {
    display.innerHTML = wglp.gScaleX.toFixed(2) + ", " + wglp.gOffsetX.toFixed(2);
  }
}

function zoomEvent(e: WheelEvent) {
  e.preventDefault();

  scale += e.deltaY * -0.01;

  // Restrict scale
  scale = Math.min(Math.max(1, scale), 100);

  if (e.shiftKey) {
    wglp.gOffsetX = 0.1 * scale;
  } else {
    wglp.gScaleX = 1 * Math.pow(scale, 1.5);
  }
}

function doneResizing(): void {
  wglp.viewport(0, 0, canv.width, canv.height);
}

function createUI(): void {
  const ui = document.getElementById("ui") as HTMLDivElement;

  display = document.createElement("p") as HTMLParagraphElement;
  display.innerHTML = "hello😉";
  ui.appendChild(display);
}
