import { WebglPlot, ColorRGBA, WebglLine } from "https://cdn.skypack.dev/webgl-plot";
const canvas = document.getElementById("my_canvas");
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const numX = Math.round(canvas.width);
const wglp = new WebglPlot(canvas);
//let line: WebglLine;
const lines = new Array();
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
    //const offset = scaleFactor / 2;
    const Nx = 6;
    const Ny = 6;
    const scaleFactorX = 1 / Nx - 0.1 / Nx;
    const scaleFactorY = 1 / Ny - 0.1 / Ny;
    for (let i = 0; i < Nx; i++) {
        for (let j = 0; j < Ny; j++) {
            const offsetX = (2 * i + 1) / Nx - 1;
            const offsetY = (2 * j + 1) / Ny - 1;
            const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
            const line = new WebglLine(color, numX);
            line.arrangeX();
            wglp.addLine(line);
            const amp = Math.random();
            const freq = Math.random() * 0.01;
            const noise = Math.random() * 0.1 * Math.log10(Nx * Ny);
            lines.push({ line, amp: amp, freq: freq, noise: noise });
            line.scaleX = scaleFactorX;
            line.scaleY = scaleFactorY;
            line.offsetX = offsetX;
            line.offsetY = offsetY;
            const ax = new WebglLine(new ColorRGBA(0.5, 0.5, 0.5, 1), 2);
            ax.xy = new Float32Array([-1.0, -1.0, 1.0, -1.0]);
            ax.scaleX = scaleFactorX;
            ax.scaleY = scaleFactorY;
            ax.offsetX = offsetX;
            ax.offsetY = offsetY;
            wglp.addAuxLine(ax);
            const ay = new WebglLine(new ColorRGBA(0.5, 0.5, 0.5, 1), 2);
            ay.xy = new Float32Array([-1.0, -1.0, -1.0, 1.0]);
            ay.scaleX = scaleFactorX;
            ay.scaleY = scaleFactorY;
            ay.offsetX = offsetX;
            ay.offsetY = offsetY;
            wglp.addAuxLine(ay);
        }
    }
}
function update() {
    lines.forEach((line) => {
        for (let i = 0; i < line.line.numPoints; i++) {
            const ySin = Math.sin(Math.PI * i * line.freq);
            const yNoise = Math.random() - 0.5;
            line.line.setY(i, ySin * line.amp + yNoise * line.noise);
        }
    });
}
function doneResizing() {
    //wglp.viewport(0, 0, canvas.width, canvas.height);
}
//# sourceMappingURL=multiPlot.js.map