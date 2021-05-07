import { WebglPlot, ColorRGBA, WebglLine } from "https://cdn.skypack.dev/webgl-plot";
import { updateAxisX, updateAxisY } from "./axis.js";
const numLines = 2;
const canvas = document.getElementById("canvas_plot");
let numX;
let wglp;
let Rect;
let scaleX = 1;
let offsetX = 0;
let scaleY = 1;
let offsetY = 0;
let pinchZoom = false;
let drag = false;
let zoom = false;
let dragInitialX = 0;
let dragOffsetOldX = 0;
let dragInitialY = 0;
let dragOffsetOldY = 0;
let initialX = 0;
let initialY = 0;
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    updateTextDisplay();
    wglp.update();
    updateAxisX(wglp.gScaleX, wglp.gOffsetX, 8);
    updateAxisY(wglp.gScaleY, wglp.gOffsetY, 8);
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);
function init() {
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
        wglp.addDataLine(line);
    }
    wglp.linesData.forEach((line) => {
        line.setY(0, Math.random() - 0.5);
        for (let i = 1; i < line.numPoints; i++) {
            let y = line.getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
            if (y > 0.9) {
                y = 0.9;
            }
            if (y < -0.9) {
                y = -0.9;
            }
            line.setY(i, y);
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
    canvas.addEventListener("touchstart", touchStart);
    canvas.addEventListener("touchmove", touchMove);
    canvas.addEventListener("touchend", touchEnd);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("dblclick", dblClick);
    canvas.addEventListener("contextmenu", contextMenu);
    //canvas.style.cursor = "zoom-in";
    //window.addEventListener("keydown", keyEvent);
}
function dblClick(e) {
    e.preventDefault();
    wglp.gScaleX = 1;
    wglp.gOffsetX = 0;
    wglp.gScaleY = 1;
    wglp.gOffsetY = 0;
}
function contextMenu(e) {
    e.preventDefault();
}
let cursorDownX = 0;
function mouseDown(e) {
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
        dragOffsetOldX = wglp.gOffsetX;
        dragInitialY = e.clientY * devicePixelRatio;
        dragOffsetOldY = wglp.gOffsetY;
    }
}
function mouseMove(e) {
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
        wglp.gOffsetX = offsetX + dragOffsetOldX;
        const moveY = e.clientY * devicePixelRatio - dragInitialY;
        const offsetY = -(wglp.gScaleY * moveY) / 500;
        wglp.gOffsetY = offsetY + dragOffsetOldY;
    }
}
function mouseUp(e) {
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
    Rect.visible = false;
}
/*
 * Pinch and Zoom
 **/
function touchStart(e) {
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
function touchMove(e) {
    e.preventDefault();
    if (pinchZoom) {
        const newX = e.touches[0].pageX - e.touches[1].pageX;
        const deltaX = (initialX - newX) / 10;
        scaleX = scaleX + deltaX;
        scaleX = Math.min(100, scaleX);
        scaleX = Math.max(1, scaleX);
        wglp.gScaleX = 1 * Math.pow(scaleX, 1.5);
        //log(diffX.toFixed(2));
        initialX = newX;
    }
    if (drag) {
        const newX = e.touches[0].pageX;
        const deltaX = initialX - newX;
        offsetX = offsetX - deltaX;
        offsetX = Math.min(1000, offsetX);
        offsetX = Math.max(-1000, offsetX);
        wglp.gOffsetX = offsetX / 100;
        initialX = newX;
    }
}
function touchEnd(e) {
    //
    e.preventDefault();
    pinchZoom = false;
    drag = false;
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
}
function log(str) {
    //display.innerHTML = str;
    console.log(str);
}
function updateTextDisplay() {
    document.getElementById("info").innerHTML = `ZoomX: ${wglp.gScaleX.toFixed(2)}, OffsetX ${wglp.gOffsetX.toFixed(2)}, ZoomY: ${wglp.gScaleY.toFixed(2)}, OffsetY ${wglp.gOffsetY.toFixed(2)} `;
}
//# sourceMappingURL=main.js.map