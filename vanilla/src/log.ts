import { WebglPlot, WebglLine, ColorRGBA } from "webgl-plot";

const gridX = document.getElementById("gridX") as HTMLInputElement;
const gridY = document.getElementById("gridY") as HTMLInputElement;
gridX.addEventListener("change", updateGrid);
gridY.addEventListener("change", updateGrid);

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

const wglp = new WebglPlot(canvas);

const numX = canvas.width;
const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
const lineMain = new WebglLine(color, numX);
lineMain.lineSpaceX(0, 2 / numX);
wglp.addDataLine(lineMain);
updateGrid();
wglp.gOffsetX = 1; //-1
wglp.gOffsetY = -1;
wglp.gScaleX = 2 / Math.log(10);
wglp.gScaleY = 2;

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
  wglp.addAuxLine(line);
}

function update(): void {
  for (let i = 0; i < lineMain.numPoints; i++) {
    const y = i / lineMain.numPoints;
    const yNoise = y + 0.1 * (Math.random() - 0.5);
    lineMain.setY(i, yNoise);
  }
}

function updateGrid(): void {
  wglp.removeAuxLines();

  console.log(gridX.value, gridY.value);
  const ngX = parseInt(gridX.value);
  const ngY = parseInt(gridY.value);
  for (let i = 0; i < ngX; i++) {
    const divPoint = i / ngX;
    addGridLine(new Float32Array([divPoint, 0, divPoint, 1]));
  }
  for (let i = 0; i < ngY; i++) {
    const divPoint = (2 * i) / (ngY - 1) - 1;
    addGridLine(new Float32Array([0, divPoint, 1, divPoint]));
  }
}
