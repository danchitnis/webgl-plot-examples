import WebGLplot, { WebglLine, ColorRGBA } from "webgl-plot";

const gridX = document.getElementById("gridX") as HTMLInputElement;
const gridY = document.getElementById("gridY") as HTMLInputElement;
gridX.addEventListener("change", updateGrid);
gridY.addEventListener("change", updateGrid);

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

const wglp = new WebGLplot(canvas);

const numX = canvas.width;
const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
const lineMain = new WebglLine(color, numX);
lineMain.lineSpaceX(-1, 2 / numX);
//wglp.addLine(lineMain);
updateGrid();

function newFrame(): void {
  update();
  wglp.update();
  requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);

function addGridLine(coords: Float32Array) {
  const color = new ColorRGBA(0.5, 0.5, 0.5, 1);
  const line = new WebglLine(color, 2);
  line.xy = coords;
  wglp.addLine(line);
}

function update(): void {
  const freq = 0.001;
  const amp = 0.5;
  const noise = 0.1;

  for (let i = 0; i < lineMain.numPoints; i++) {
    const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
    const yNoise = Math.random() - 0.5;
    lineMain.setY(i, ySin * amp + yNoise * noise);
  }
}

function updateGrid(): void {
  wglp.removeAllLines();
  wglp.addLine(lineMain);
  console.log(gridX.value, gridY.value);
  const ngX = parseInt(gridX.value);
  const ngY = parseInt(gridY.value);
  for (let i = 0; i < ngX; i++) {
    const divPoint = (2 * i) / (ngX - 1) - 1;
    addGridLine(new Float32Array([divPoint, -1, divPoint, 1]));
  }
  for (let i = 0; i < ngY; i++) {
    const divPoint = (2 * i) / (ngY - 1) - 1;
    addGridLine(new Float32Array([-1, divPoint, 1, divPoint]));
  }
}
