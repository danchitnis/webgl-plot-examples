import { WebglPlot, ColorRGBA, WebglLine } from "webgl-plot";
const numLines = 2;
const AuxLines = { crossX: 0, crossY: 1, testRec: 2 };
const canvas = document.getElementById("my_canvas");
const info = document.getElementById("info");
let crossX = 0;
let crossY = 0;
let numX;
let wglp;
createUI();
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    updateTextDisplay();
    wglp.update();
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
    // test rec
    const testRect = new WebglLine(new ColorRGBA(0.1, 0.9, 0.9, 1), 4);
    testRect.loop = true;
    testRect.xy = new Float32Array([-0.7, -0.8, -0.7, 0.8, -0.6, 0.8, -0.6, -0.8]);
    //wglp.viewport(0, 0, 1000, 1000);
    wglp.gScaleX = 1;
    canvas.addEventListener("dblclick", dblClick);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("contextmenu", contextMenu);
    //canvas.style.cursor = "zoom-in";
    canvas.style.cursor = "crosshair";
    //add cross
    const green = new ColorRGBA(0.1, 0.9, 0.1, 1);
    wglp.addAuxLine(new WebglLine(green, 2));
    wglp.addAuxLine(new WebglLine(green, 2));
    wglp.addAuxLine(testRect);
}
function mouseMove(e) {
    const x = (1 / wglp.gScaleX) *
        ((2 * ((e.pageX - canvas.offsetLeft) * devicePixelRatio - canvas.width / 2)) / canvas.width -
            wglp.gOffsetX);
    const y = (1 / wglp.gScaleY) *
        ((2 * (canvas.height / 2 - (e.pageY - canvas.offsetTop) * devicePixelRatio)) / canvas.height -
            wglp.gOffsetY);
    cross(x, y);
}
function cross(x, y) {
    wglp.linesAux[AuxLines.crossX].xy = new Float32Array([x, -1, x, 1]);
    wglp.linesAux[AuxLines.crossY].xy = new Float32Array([-1, y, 1, y]);
    crossX = x;
    crossY = y;
}
function dblClick(e) {
    e.preventDefault();
    wglp.gScaleX = 1;
    wglp.gOffsetX = 0;
}
function contextMenu(e) {
    e.preventDefault();
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
}
function createUI() {
    const sliderScale = document.getElementById("sliderScale");
    sliderScale.addEventListener("input", () => {
        wglp.gScaleX = sliderScale.value;
        updateTextDisplay();
    });
    const sliderOffset = document.getElementById("sliderOffset");
    sliderOffset.addEventListener("input", () => {
        wglp.gOffsetX = -1 * sliderOffset.value * wglp.gScaleX;
        updateTextDisplay();
    });
}
function log(str) {
    //display.innerHTML = str;
    console.log(str);
}
function updateTextDisplay() {
    info.innerHTML = `Zoom: ${wglp.gScaleX.toFixed(2)}, Offset ${wglp.gOffsetX.toFixed(2)}, X:${crossX.toFixed(3)} Y:${crossY.toFixed(3)}`;
}
//# sourceMappingURL=cross.js.map