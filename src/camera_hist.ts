import * as noUiSlider from "nouislider";

import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";

import * as Statsjs from "stats.js";

const canv = document.getElementById("my_canvas") as HTMLCanvasElement;
const player = document.getElementById("player") as HTMLVideoElement;
const camera = document.getElementById("camera") as HTMLCanvasElement;

const context = camera.getContext("2d");

let numX: number;

let segView = false;

let N = 0;

let wglp: WebGLplot;
let lineR: WebglLine;
let lineG: WebglLine;
let lineB: WebglLine;

const stats = new Statsjs();
//stats.showPanel(0);
//document.body.appendChild(stats.dom);

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 500);
});

function newFrame(): void {
  stats.begin();

  update();

  wglp.update();
  //wglp.gScaleY = scaleY;

  stats.end();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

function init(): void {
  // Create the canvas and get a context

  // Set the canvas to be the same size as the original image

  // Draw the image onto the top-left corner of the canvas

  const handleSuccess = function (stream: MediaStream) {
    player.srcObject = stream;
  };

  navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(handleSuccess);

  player.height = 0;
  player.width = 0;

  camera.width = 4 * 100;
  camera.height = 3 * 100;

  //let imageData = 0;
  //let pixels = 0;

  const devicePixelRatio = window.devicePixelRatio || 1;
  //numX = Math.round(canv.clientWidth * devicePixelRatio);
  //numX = camera.width;
  numX = 256;

  lineR = new WebglLine(new ColorRGBA(0.9, 0.2, 0.2, 1), numX);
  lineG = new WebglLine(new ColorRGBA(0.2, 0.9, 0.2, 1), numX);
  lineB = new WebglLine(new ColorRGBA(0.2, 0.2, 0.9, 1), numX);

  wglp = new WebGLplot(canv);

  wglp.gOffsetY = -1;
  wglp.gScaleY = 1.9;

  lineR.lineSpaceX(-1, 2 / numX);
  lineG.lineSpaceX(-1, 2 / numX);
  lineB.lineSpaceX(-1, 2 / numX);
  wglp.addLine(lineR);
  wglp.addLine(lineG);
  wglp.addLine(lineB);
}

function update(): void {
  context.drawImage(player, 0, 0, camera.width, camera.height);
  const imageData = context.getImageData(0, 0, camera.width, camera.height);
  const pixels = imageData.data;

  const yHistR = new Uint32Array(256);
  const yHistG = new Uint32Array(256);
  const yHistB = new Uint32Array(256);

  let i = 0;
  for (i = 0; i < camera.width * camera.height; i++) {
    yHistR[pixels[i * 4 + 0]]++;
    yHistG[pixels[i * 4 + 1]]++;
    yHistB[pixels[i * 4 + 2]]++;
  }

  const max = Math.max(...yHistR, ...yHistG, ...yHistB);
  for (i = 0; i < lineR.numPoints; i++) {
    lineR.setY(i, yHistR[i] / max);
    lineG.setY(i, yHistG[i] / max);
    lineB.setY(i, yHistB[i] / max);
  }

  if (N == 120) {
    //console.log(pixels);
  }
  N++;
}

function doneResizing(): void {
  wglp.viewport(0, 0, canv.width, canv.height);
}

function createUI(): void {
  const ui = document.getElementById("ui") as HTMLDivElement;
}
