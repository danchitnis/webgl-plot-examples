/**
 * Author Danial Chitnis 2019
 */
import { WebglPlot, ColorRGBA, WebglLine } from "webgl-plot";
const canvas = document.getElementById("my_canvas");
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const numX = Math.round(canvas.width);
const wglp = new WebglPlot(canvas);
let numLines = 1;
let scaleY = 1;
//let lines: WebglLine[];
let fpsDivder = 1;
let fpsCounter = 0;
// new data per frame
let newDataSize = 1;
const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
setSliders();
/*let bt = <HTMLButtonElement>document.getElementById("bt");
bt.addEventListener("click",btclick);*/
init();
function newFrame() {
    if (fpsCounter === 0) {
        plot(newDataSize);
        wglp.gScaleY = scaleY;
        wglp.update();
    }
    fpsCounter++;
    if (fpsCounter >= fpsDivder) {
        fpsCounter = 0;
    }
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);
function plot(shiftSize) {
    wglp.linesData.forEach((line) => {
        const yArray = randomWalk(line.getY(numX - 1), shiftSize);
        line.shiftAdd(yArray);
    });
}
function randomWalk(initial, walkSize) {
    const y = new Float32Array(walkSize);
    y[0] = initial + 0.01 * (Math.round(Math.random()) - 0.5);
    for (let i = 1; i < walkSize; i++) {
        y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
    }
    return y;
}
function init() {
    wglp.removeAllLines();
    for (let i = 0; i < numLines; i++) {
        const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
        const line = new WebglLine(color, numX);
        line.arrangeX();
        wglp.addLine(line);
    }
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
}
function setSliders() {
    const sliderLine = document.getElementById("sliderLine");
    sliderLine.addEventListener("input", () => {
        numLines = lineNumList[Math.round(sliderLine.value)];
    });
    sliderLine.addEventListener("change", () => {
        init();
    });
    sliderLine.getAriaValueText = () => {
        return `${numLines}`;
    };
    const sliderYScale = document.getElementById("sliderYScale");
    sliderYScale.addEventListener("input", () => {
        scaleY = sliderYScale.value;
    });
    const sliderNewData = document.getElementById("sliderNewData");
    sliderNewData.addEventListener("input", () => {
        newDataSize = sliderNewData.value;
    });
    const sliderFps = document.getElementById("sliderFps");
    sliderFps.addEventListener("input", () => {
        fpsDivder = sliderFps.value;
    });
    sliderFps.getAriaValueText = () => {
        return `${Math.round(60 / fpsDivder)}`;
    };
}
//# sourceMappingURL=randomness.js.map