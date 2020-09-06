import * as noUiSlider from "nouislider";
import WebGLplot, { ColorRGBA, WebglPolar } from "webgl-plot";
import * as Statsjs from "stats.js";
let amp = 0.5;
let updateRate = 0.1;
let preR = 0.5;
const canvas = document.getElementById("my_canvas");
let indexNow = 0;
let numPoints = 100;
let wglp;
let line;
let line2;
const lineColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
const lineNumList = [3, 4, 5, 6, 7, 8, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
let sliderLines;
let sliderAmp;
let sliderUpdateRate;
let displayLines;
let displayAmp;
let displayUpdateRate;
const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);
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
    stats.begin();
    wglp.update();
    stats.end();
    window.requestAnimationFrame(newFrame);
}
window.requestAnimationFrame(newFrame);
function init() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const numX = canvas.width;
    const numY = canvas.height;
    line = new WebglPolar(lineColor, numPoints);
    line.loop = true;
    line2 = new WebglPolar(new ColorRGBA(0.9, 0.9, 0.9, 1), 2);
    line2.xy = new Float32Array([0, 0, 1, 1]);
    wglp = new WebGLplot(canvas);
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
    const ui = document.getElementById("ui");
    // ******slider lines */
    sliderLines = document.createElement("div");
    sliderLines.style.width = "100%";
    noUiSlider.create(sliderLines, {
        start: [8],
        step: 1,
        connect: [true, false],
        // tooltips: [false, wNumb({decimals: 1}), true],
        range: {
            min: 0,
            max: lineNumList.length - 1,
        },
    });
    displayLines = document.createElement("span");
    ui.appendChild(sliderLines);
    ui.appendChild(displayLines);
    ui.appendChild(document.createElement("p"));
    sliderLines.noUiSlider.on("update", (values, handle) => {
        numPoints = lineNumList[parseFloat(values[handle])];
        displayLines.innerHTML = `Line number: ${numPoints}`;
    });
    sliderLines.noUiSlider.on("set", () => {
        init();
    });
    // ******slider amp */
    sliderAmp = document.createElement("div");
    sliderAmp.style.width = "100%";
    noUiSlider.create(sliderAmp, {
        start: [0.5],
        step: 0.001,
        connect: [true, false],
        // tooltips: [false, wNumb({decimals: 1}), true],
        range: {
            min: 0,
            max: 1,
        },
    });
    displayAmp = document.createElement("span");
    ui.appendChild(sliderAmp);
    ui.appendChild(displayAmp);
    ui.appendChild(document.createElement("p"));
    sliderAmp.noUiSlider.on("update", (values, handle) => {
        const k = 0.5;
        amp = k * parseFloat(values[handle]);
        displayAmp.innerHTML = `Randomness Amplitude: ${amp / k}`;
    });
    // ******slider noise */
    sliderUpdateRate = document.createElement("div");
    sliderUpdateRate.style.width = "100%";
    noUiSlider.create(sliderUpdateRate, {
        start: [1],
        step: 1,
        connect: [true, false],
        // tooltips: [false, wNumb({decimals: 1}), true],
        range: {
            min: 1,
            max: 100,
        },
    });
    displayUpdateRate = document.createElement("span");
    ui.appendChild(sliderUpdateRate);
    ui.appendChild(displayUpdateRate);
    ui.appendChild(document.createElement("p"));
    sliderUpdateRate.noUiSlider.on("update", (values, handle) => {
        const k = 1;
        updateRate = k * parseFloat(values[handle]);
        //fpsDivder = k * parseFloat(values[handle]);
        displayUpdateRate.innerHTML = `Update Rate: ${updateRate / k}`;
        clearInterval(timer);
        timer = setInterval(update, updateRate);
    });
}
//# sourceMappingURL=radar.js.map