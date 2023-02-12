import { WebglPlot, ColorRGBA, WebglPolar } from "webgl-plot";
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
    const sliderLines = document.getElementById("sliderLine");
    sliderLines.max = numPointList.length - 1;
    sliderLines.addEventListener("input", () => {
        numPoints = numPointList[Math.round(sliderLines.value)];
        init();
    });
    sliderLines.getAriaValueText = () => {
        return numPoints.toString();
    };
    const sliderAmp = document.getElementById("sliderAmp");
    sliderAmp.addEventListener("input", () => {
        amp = sliderAmp.value;
    });
    const sliderUpdateRate = document.getElementById("sliderUpdateRate");
    sliderUpdateRate.addEventListener("input", () => {
        updateRate = Math.round(sliderUpdateRate.value);
        clearInterval(timer);
        timer = setInterval(update, updateRate);
    });
}
//# sourceMappingURL=radar.js.map