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
let Rect: WebglLine;

let scale = 1;
let offset = 0;
let pinchZoom = false;
let drag = false;
let zoom = false;

let dragInitialX = 0;
let dragOffsetOld = 0;

let initialX = 0;

createUI();

init();

let resizeId: number;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeId);
  resizeId = window.setTimeout(doneResizing, 500);
});

function newFrame(): void {
  update();

  //wglp.clear();

  wglp.update();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

function init(): void {
  const devicePixelRatio = window.devicePixelRatio || 1;
  //numX = Math.round(canv.clientWidth * devicePixelRatio);
  numX = 100000;

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

  // add zoom rectangle
  Rect = new WebglLine(new ColorRGBA(0.9, 0.9, 0.9, 1), 4);
  Rect.loop = true;
  Rect.xy = new Float32Array([-0.5, -1, -0.5, 1, 0.5, 1, 0.5, -1]);
  Rect.visible = false;
  wglp.addLine(Rect);

  // test rec
  const testRect = new WebglLine(new ColorRGBA(0.1, 0.9, 0.9, 1), 4);
  testRect.loop = true;
  testRect.xy = new Float32Array([-0.7, -0.8, -0.7, 0.8, -0.6, 0.8, -0.6, -0.8]);
  wglp.addLine(testRect);

  /*for (let j = 0; j < lines.length; j++) {
    for (let i = 0; i < lines[j].numPoints; i++) {
      const ySin = Math.sin(Math.PI * i * freq + (j / lines.length) * Math.PI * 2);
      const yNoise = Math.random() - 0.5;
      lines[j].setY(i, ySin * amp + yNoise * noise);
    }
  }*/

  for (let j = 0; j < lines.length; j++) {
    for (let i = 1; i < lines[j].numPoints; i++) {
      let y = lines[j].getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
      if (y > 0.9) {
        y = 0.9;
      }
      if (y < -0.9) {
        y = -0.9;
      }
      lines[j].setY(i, y);
    }
  }

  //wglp.viewport(0, 0, 1000, 1000);
  wglp.gScaleX = 1;

  canv.addEventListener("wheel", zoomEvent);
  canv.addEventListener("touchstart", touchStart);
  canv.addEventListener("touchmove", touchMove);
  canv.addEventListener("touchend", touchEnd);

  canv.addEventListener("mousedown", mouseDown);
  canv.addEventListener("mousemove", mouseMove);
  canv.addEventListener("mouseup", mouseUp);

  canv.addEventListener("dblclick", dblClick);

  canv.addEventListener("contextmenu", contextMenu);

  canv.style.cursor = "zoom-in";

  //window.addEventListener("keydown", keyEvent);
}

function update(): void {
  if (wglp) {
    display.innerHTML =
      "Zoom: " + wglp.gScaleX.toFixed(2) + ", Offset: " + wglp.gOffsetX.toFixed(2);
  }
}

function dblClick(e: MouseEvent) {
  e.preventDefault();
  wglp.gScaleX = 1;
  wglp.gOffsetX = 0;
}

function contextMenu(e: Event) {
  e.preventDefault();
}

let cursorDownX = 0;

function mouseDown(e: MouseEvent) {
  e.preventDefault();
  if (e.button == 0) {
    zoom = true;
    canv.style.cursor = "pointer";
    cursorDownX = (2 * (e.clientX - canv.width / 2)) / canv.width;
    //cursorDownX = (cursorDownX - wglp.gOffsetX) / wglp.gScaleX;

    Rect.visible = true;
  }
  if (e.button == 2) {
    drag = true;
    canv.style.cursor = "grabbing";
    dragInitialX = e.clientX;
    dragOffsetOld = wglp.gOffsetX;
  }
}

function mouseMove(e: MouseEvent) {
  e.preventDefault();
  if (zoom) {
    const cursorOffsetX = (2 * (e.clientX - canv.width / 2)) / canv.width;
    Rect.xy = new Float32Array([
      (cursorDownX - wglp.gOffsetX) / wglp.gScaleX,
      -1,
      (cursorDownX - wglp.gOffsetX) / wglp.gScaleX,
      1,
      (cursorOffsetX - wglp.gOffsetX) / wglp.gScaleX,
      1,
      (cursorOffsetX - wglp.gOffsetX) / wglp.gScaleX,
      -1,
    ]);
    Rect.visible = true;
  }
  if (drag) {
    const moveX = e.clientX - dragInitialX;
    const offsetX = (wglp.gScaleY * moveX) / 1000;
    wglp.gOffsetX = offsetX + dragOffsetOld;
  }
}

function mouseUp(e: MouseEvent) {
  e.preventDefault();
  if (zoom) {
    const cursorUpX = (2 * (e.clientX - canv.width / 2)) / canv.width;
    console.log(cursorDownX, cursorUpX);

    const zoomFactor = Math.abs(cursorUpX - cursorDownX) / (2 * wglp.gScaleX);
    const offsetFactor = (cursorDownX + cursorUpX - 2 * wglp.gOffsetX) / (2 * wglp.gScaleX);

    if (zoomFactor > 0) {
      wglp.gScaleX = 1 / zoomFactor;
      wglp.gOffsetX = -offsetFactor / zoomFactor;
    }
  }

  zoom = false;
  drag = false;
  canv.style.cursor = "zoom-in";
  //Rect.visible = false;
}

function zoomEvent(e: WheelEvent) {
  e.preventDefault();

  const cursorOffsetX = (-2 * (e.clientX - canv.width / 2)) / canv.width;
  console.log(cursorOffsetX);

  if (e.shiftKey) {
    offset += e.deltaY * 0.1;
    wglp.gOffsetX = 0.1 * offset;
  } else {
    scale += e.deltaY * -0.01;
    scale = Math.min(100, scale);
    scale = Math.max(1, scale);
    const gScaleXOld = wglp.gScaleX;

    wglp.gScaleX = 1 * Math.pow(scale, 1.5);
    if (scale > 1 && scale < 100) {
      wglp.gOffsetX = ((wglp.gOffsetX + cursorOffsetX) * wglp.gScaleX) / gScaleXOld;
    }
    if (scale <= 1) {
      wglp.gOffsetX = 0;
    }
  }
}

/*
 * Pinch and Zoom
 **/

function touchStart(e: TouchEvent) {
  //
  e.preventDefault();
  log("touched");
  if (e.touches.length == 2) {
    pinchZoom = true;
    drag = false;
    initialX = e.touches[0].pageX - e.touches[1].pageX;
    log("pinch started");
  }
  if (e.touches.length == 1) {
    drag = true;
    pinchZoom = false;
    initialX = e.touches[0].pageX;
  }
}

function touchMove(e: TouchEvent) {
  e.preventDefault();
  if (pinchZoom) {
    const newX = e.touches[0].pageX - e.touches[1].pageX;

    const deltaX = (initialX - newX) / 10;

    scale = scale + deltaX;
    scale = Math.min(100, scale);
    scale = Math.max(1, scale);
    wglp.gScaleX = 1 * Math.pow(scale, 1.5);

    //log(diffX.toFixed(2));
    initialX = newX;
  }
  if (drag) {
    const newX = e.touches[0].pageX;
    const deltaX = initialX - newX;
    offset = offset - deltaX;
    offset = Math.min(1000, offset);
    offset = Math.max(-1000, offset);
    wglp.gOffsetX = offset / 100;
    initialX = newX;
  }
}

function touchEnd(e: TouchEvent) {
  //
  e.preventDefault();
  pinchZoom = false;
  drag = false;
}

function updateZoomRect(x1: number, x2: number): void {
  //
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

function log(str: string) {
  display.innerHTML = str;
}
