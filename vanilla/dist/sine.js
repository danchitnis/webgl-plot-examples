import { WebglPlot, ColorRGBA, WebglLine } from "webgl-plot";
let amp = 0.5;
let noise = 0.1;
let freq = 0.01;
const canvas = document.getElementById("my_canvas");
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const numX = Math.round(canvas.width);
const wglp = new WebglPlot(canvas);
let numLines = 1;
let segView = false;
const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
createUI();
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    update();
    wglp.update();
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);
function init() {
    wglp.removeAllLines();
    for (let i = 0; i < numLines; i++) {
        const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
        const line = new WebglLine(color, numX);
        line.arrangeX();
        wglp.addLine(line);
    }
}
function update() {
    wglp.linesData.forEach((line, index) => {
        for (let i = 0; i < line.numPoints; i++) {
            const ySin = Math.sin(Math.PI * i * freq + (index / wglp.linesData.length) * Math.PI * 2);
            const yNoise = Math.random() - 0.5;
            line.setY(i, ySin * amp + yNoise * noise);
        }
    });
}
function doneResizing() {
    //wglp.viewport(0, 0, canvas.width, canvas.height);
}
function changeView() {
    if (segView) {
        wglp.linesData.forEach((line) => {
            line.offsetY = 0;
            line.scaleY = 1;
        });
        segView = false;
    }
    else {
        wglp.linesData.forEach((line, index) => {
            line.offsetY = 1.5 * (index / wglp.linesData.length - 0.5);
            line.scaleY = 1.5 / wglp.linesData.length;
        });
        segView = true;
    }
}
function createUI() {
    const spsl1 = document.getElementById("sp-sl-1");
    spsl1.addEventListener("input", (e) => {
        const value = e.target.value;
        numLines = lineNumList[value];
    });
    spsl1.addEventListener("change", (e) => {
        init();
    });
    spsl1.getAriaValueText = () => {
        return `${numLines}`;
    };
    const spsl2 = document.getElementById("sp-sl-2");
    spsl2.addEventListener("input", (e) => {
        freq = e.target.value;
    });
    const spsl3 = document.getElementById("sp-sl-3");
    spsl3.addEventListener("input", (e) => {
        amp = e.target.value;
    });
    const spsl4 = document.getElementById("sp-sl-4");
    spsl4.addEventListener("input", (e) => {
        noise = e.target.value;
    });
    const btView = document.getElementById("btView");
    btView.addEventListener("click", () => {
        changeView();
    });
}
//# sourceMappingURL=sine.js.map