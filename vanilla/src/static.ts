import { SimpleSlider } from "@danchitnis/simple-slider";
import { WebglPlot, ColorRGBA, WebglLine } from "webgl-plot";

let numLines = 2;
const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

let numX: number;

let wglp: WebglPlot;

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
  updateTextDisplay();

  wglp.update();

  requestAnimationFrame(newFrame);
}

requestAnimationFrame(newFrame);

function init(): void {
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  numX = 10000;

  wglp = new WebglPlot(canvas);

  wglp.removeAllLines();

  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    const line = new WebglLine(color, numX);
    line.lineSpaceX(-1, 2 / numX);
    wglp.addLine(line);
  }

  wglp.linesData.forEach((line) => {
    (line as WebglLine).setY(0, Math.random() - 0.5);
    for (let i = 1; i < line.numPoints; i++) {
      let y = (line as WebglLine).getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
      if (y > 0.9) {
        y = 0.9;
      }
      if (y < -0.9) {
        y = -0.9;
      }
      (line as WebglLine).setY(i, y);
    }
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

  //wglp.viewport(0, 0, 1000, 1000);
  wglp.gScaleX = 1;

  canvas.addEventListener("wheel", zoomEvent);
  canvas.addEventListener("touchstart", touchStart);
  canvas.addEventListener("touchmove", touchMove);
  canvas.addEventListener("touchend", touchEnd);

  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mouseup", mouseUp);

  canvas.addEventListener("dblclick", dblClick);

  canvas.addEventListener("contextmenu", contextMenu);

  canvas.style.cursor = "zoom-in";

  //window.addEventListener("keydown", keyEvent);
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
  console.log(e.clientX);
  if (e.button == 0) {
    zoom = true;
    canvas.style.cursor = "pointer";
    cursorDownX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
    //cursorDownX = (cursorDownX - wglp.gOffsetX) / wglp.gScaleX;

    Rect.visible = true;
  }
  if (e.button == 2) {
    drag = true;
    canvas.style.cursor = "grabbing";
    dragInitialX = e.clientX * devicePixelRatio;
    dragOffsetOld = wglp.gOffsetX;
  }
}

function mouseMove(e: MouseEvent) {
  e.preventDefault();
  if (zoom) {
    const cursorOffsetX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
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
    const moveX = e.clientX * devicePixelRatio - dragInitialX;
    const offsetX = (wglp.gScaleY * moveX) / 1000;
    wglp.gOffsetX = offsetX + dragOffsetOld;
  }
}

function mouseUp(e: MouseEvent) {
  e.preventDefault();
  if (zoom) {
    const cursorUpX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;

    const zoomFactor = Math.abs(cursorUpX - cursorDownX) / (2 * wglp.gScaleX);
    const offsetFactor = (cursorDownX + cursorUpX - 2 * wglp.gOffsetX) / (2 * wglp.gScaleX);

    if (zoomFactor > 0) {
      wglp.gScaleX = 1 / zoomFactor;
      wglp.gOffsetX = -offsetFactor / zoomFactor;
    }
  }

  zoom = false;
  drag = false;
  canvas.style.cursor = "zoom-in";
  //Rect.visible = false;
}

function zoomEvent(e: WheelEvent) {
  e.preventDefault();

  const cursorOffsetX = (-2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;

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
}

function log(str: string) {
  //display.innerHTML = str;
  console.log(str);
}

function updateTextDisplay() {
  document.getElementById("info").innerHTML = `Zoom: ${wglp.gScaleX.toFixed(
    2
  )}, Offset ${wglp.gOffsetX.toFixed(2)}`;
  document.getElementById("numLines").innerHTML = `Line number: ${numLines}`;
}
