import { SimpleSlider } from "https://cdn.skypack.dev/@danchitnis/simple-slider";
import { WebglPlot, ColorRGBA, WebglPolar } from "https://cdn.skypack.dev/webgl-plot";
let rotation = 0.1;
let freq = 0.01;
const canvas = document.getElementById("my_canvas");
const numPointList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
let numPoints = numPointList[9];
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const wglp = new WebglPlot(canvas);
let line;
createUI();
init();
updateTextDisplay();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 100);
});
function newFrame() {
    update();
    wglp.update();
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);
function init() {
    wglp.removeAllLines();
    const numX = canvas.width;
    const numY = canvas.height;
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    line = new WebglPolar(color, numPoints);
    wglp.gScaleX = numY / numX;
    wglp.gScaleY = 1;
    wglp.addLine(line);
}
function update() {
    line.offsetTheta = 10 * rotation;
    for (let i = 0; i < line.numPoints; i++) {
        const theta = (i * 360) / line.numPoints;
        const r = Math.cos((2 * Math.PI * freq * theta) / 360);
        line.setRtheta(i, theta, r);
    }
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
    init();
}
function createUI() {
    // ******slider lines */
    const sliderLines = new SimpleSlider("sliderLine", 0, numPointList.length - 1, numPointList.length);
    sliderLines.setValue(9);
    sliderLines.callBackUpdate = () => {
        numPoints = numPointList[Math.round(sliderLines.value)];
        updateTextDisplay();
    };
    sliderLines.callBackDragEnd = () => {
        init();
    };
    // ******slider Freq */
    const sliderFreq = new SimpleSlider("sliderFreq", 0, 5, 0);
    //sliderYSclae.setDebug(true);
    sliderFreq.setValue(freq);
    sliderFreq.callBackUpdate = () => {
        freq = sliderFreq.value;
        updateTextDisplay();
    };
    // ******slider Rotation */
    const sliderRotation = new SimpleSlider("sliderRotation", 0, 5, 0);
    //sliderYSclae.setDebug(true);
    sliderRotation.setValue(rotation);
    sliderRotation.callBackUpdate = () => {
        rotation = sliderRotation.value;
        updateTextDisplay();
    };
}
function updateTextDisplay() {
    document.getElementById("numLines").innerHTML = `Line number: ${numPoints}`;
    document.getElementById("freq").innerHTML = `Y scale = ${freq.toFixed(2)}`;
    document.getElementById("rotation").innerHTML = `New Data Size = ${rotation.toFixed(2)}`;
}
//# sourceMappingURL=polar.js.map