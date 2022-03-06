import { WebglPlot, ColorRGBA, WebglThickLine } from "https://cdn.skypack.dev/webgl-plot";

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

const wglp = new WebglPlot(canvas);

const numX = canvas.width;
const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
const lineThick = new WebglThickLine(color, numX, 0.01);
lineThick.lineSpaceX(-1, 2 / numX);
wglp.addThickLine(lineThick);

function newFrame(): void {
  update();
  wglp.update();
  requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);

function update(): void {
  const freq = 0.001;
  const amp = 0.5;
  const noise = 0.01;

  for (let i = 0; i < lineThick.numPoints; i++) {
    const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    const yNoise = Math.random() - 0.5;
    lineThick.setY(i, ySin * amp + yNoise * noise);
  }
}
