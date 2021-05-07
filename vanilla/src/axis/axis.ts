//import { unitConvert2string } from "./sim/unitConverter";

const canvasX = document.getElementById("canvas_xAxis") as HTMLCanvasElement;
const canvasY = document.getElementById("canvas_yAxis") as HTMLCanvasElement;

//let canvasSize = { width: 0, height: 0 } as CanvasSize;

const initCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  //canvasSize = { width: canvas.width, height: canvas.height };

  const ctx2d = canvas.getContext("2d");
  if (ctx2d) {
    ctx2d.font = "16px Courier New";
    ctx2d.fillStyle = "white";
    ctx2d.strokeStyle = "white";
  }
  return ctx2d;

  //const rect = canvas?.getBoundingClientRect();
  //console.log("axis->", rect);
};

const ctxX = initCanvas(canvasX);
const ctxY = initCanvas(canvasY);

const updateX = (
  ctx2d: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  offset: number,
  divs: number
) => {
  ctx2d.clearRect(0, 0, width, height);

  for (let i = 0; i < divs; i++) {
    const midpoint = -(offset - i / (divs / 2) + 1) / scale;
    const x = (i / divs) * width;

    ctx2d.fillText(`${midpoint.toExponential(2)}`, x, 15);
    //ctx.fillRect(10, 10, 100, 100);
    ctx2d.moveTo(x, 0);
    ctx2d.lineTo(x, 10);
    ctx2d.stroke();
  }
};

const updateY = (
  ctx2d: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  offset: number,
  divs: number
) => {
  //console.log("yaxis->", canvasSize);
  ctx2d.clearRect(0, 0, width, height);
  for (let i = 0; i < divs; i++) {
    const midpoint = -(offset + i / (divs / 2) - 1) / scale;
    const y = (i / divs) * height;

    ctx2d.fillText(`${midpoint.toExponential(2)}`, 5, y);
    //ctx.fillRect(10, 10, 100, 100);
    ctx2d.moveTo(width - 10, y);
    ctx2d.lineTo(width, y);
    ctx2d.stroke();
  }
};

export const updateAxisX = (scale: number, offset: number, divs: number): void => {
  //console.log("axis->", axis == "y");
  //console.log("axis->", midpoint);
  if (ctxX) {
    updateX(ctxX, canvasX.width, canvasX.height, scale, offset, divs);
  }
};

export const updateAxisY = (scale: number, offset: number, divs: number): void => {
  if (ctxY) {
    updateY(ctxY, canvasY.width, canvasY.height, scale, offset, divs);
  }
};

//updateAxisX(1, 0);
