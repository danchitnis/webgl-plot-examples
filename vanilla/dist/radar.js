import { SimpleSlider } from "https://cdn.skypack.dev/@danchitnis/simple-slider";
import { WebglPlot, ColorRGBA, WebglPolar } from "https://cdn.skypack.dev/webgl-plot";
let amp = 0.5;
let updateRate = 0.1;
let preR = 0.5;
const canvas = document.getElementById("my_canvas");
let indexNow = 0;
const numPointList = [3, 4, 5, 6, 7, 8, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
let numPoints = numPointList[9];
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const wglp = new WebglPlot(canvas);
let line;
let line2;
const lineColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 100);
});
let timer = setInterval(() => {
    update();
}, updateRate * 10);
createUI();
init();
updateTextDisplay();
/****************************************/
function newFrame() {
    wglp.update();
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);
function init() {
    wglp.removeAllLines();
    const numX = canvas.width;
    const numY = canvas.height;
    line = new WebglPolar(lineColor, numPoints);
    line.loop = true;
    line2 = new WebglPolar(new ColorRGBA(0.9, 0.9, 0.9, 1), 2);
    line2.xy = new Float32Array([0, 0, 1, 1]);
    //wglp.offsetX = -1;
    wglp.gScaleX = numY / numX;
    wglp.gScaleY = 1;
    //line.linespaceX(-1, 2  / numX);
    wglp.addLine(line);
    wglp.addLine(line2);
    for (let i = 0; i < line.numPoints; i++) {
        const theta = (i * 360) / line.numPoints;
        const r = amp * 1;
        //const r = 1;
        line.setRtheta(i, theta, r);
    }
}
function update() {
    //line.offsetTheta = 10*noise;
    //preR form previous update
    if (indexNow < line.numPoints) {
        const theta = (indexNow * 360) / line.numPoints;
        let r = amp * (Math.random() - 0.5) + preR;
        line.setRtheta(indexNow, theta, r);
        line2.setRtheta(0, 0, 0);
        line2.setRtheta(1, theta, 1);
        //line2.setX(1,line.getX(indexNow));
        //line2.setY(1,line.getY(indexNow));
        r = r < 1 ? r : 1;
        r = r > 0.1 ? r : 0.1;
        preR = r;
        indexNow++;
    }
    else {
        indexNow = 0;
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
    const sliderAmp = new SimpleSlider("sliderAmp", 0, 1, 0);
    //sliderYSclae.setDebug(true);
    sliderAmp.setValue(amp);
    sliderAmp.callBackUpdate = () => {
        amp = sliderAmp.value;
        updateTextDisplay();
    };
    const sliderUpdateRate = new SimpleSlider("sliderUpdateRate", 1, 100, 100);
    //sliderYSclae.setDebug(true);
    sliderUpdateRate.setValue(updateRate);
    sliderUpdateRate.callBackUpdate = () => {
        updateRate = Math.round(sliderUpdateRate.value);
        updateTextDisplay();
        clearInterval(timer);
        timer = setInterval(update, updateRate);
    };
}
function updateTextDisplay() {
    document.getElementById("numLines").innerHTML = `Line number: ${numPoints}`;
    document.getElementById("amp").innerHTML = `Y scale = ${amp}`;
    document.getElementById("rate").innerHTML = `New Data Size = ${updateRate}`;
}
//# sourceMappingURL=radar.js.map