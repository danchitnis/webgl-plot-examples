import { WebglPlot, ColorRGBA, WebglStep } from "webgl-plot";
let randXSize = 10;
//let maxY = 0;
const xmin = 0;
const xmax = 100;
let numBins = 100;
let Xmin = 40;
let Xmax = 60;
let Xskew = 1;
const canvas = document.getElementById("my_canvas");
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
let scaleY = 1;
let X;
let xbins;
let ybins;
let wglp;
let line;
const randXSizeList = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const binSizeNumber = [2, 5, 10, 20, 50, 100, 200, 500, 1000];
createUI();
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    update();
    wglp.gScaleY = scaleY;
    wglp.update();
    window.requestAnimationFrame(newFrame);
}
window.requestAnimationFrame(newFrame);
function init() {
    wglp = new WebglPlot(canvas);
    xbins = new Float32Array(numBins);
    ybins = new Float32Array(numBins);
    wglp.gOffsetY = -1;
    wglp.gOffsetX = -1;
    wglp.gScaleX = 2 / numBins;
    for (let i = 0; i < xbins.length; i++) {
        xbins[i] = (i * (xmax - xmin)) / numBins + xmin;
    }
    const color = new ColorRGBA(1, 1, 0, 0.5);
    line = new WebglStep(color, numBins);
    // line.linespaceX(-1, 2 / numBins);
    // instead of line above we are applying offsetX and scaleX
    line.lineSpaceX(0, 1);
    wglp.addLine(line);
}
function update() {
    X = new Float32Array(randXSize);
    randnArray(X);
    for (let i = 0; i < ybins.length; i++) {
        ybins[i] = 0;
    }
    for (let i = 0; i < X.length; i++) {
        const bin = X[i];
        if (bin < xmin) {
            ybins[0]++;
        }
        else {
            if (bin > xmax) {
                ybins[numBins - 1]++;
            }
            else {
                const index = (numBins * (bin - xmin)) / (xmax - xmin);
                ybins[Math.floor(index)]++;
            }
        }
    }
    // Normalize ?
    for (let i = 0; i < ybins.length; i++) {
        const y = (ybins[i] / randXSize) * numBins;
        line.setY(i, y * 0.02);
    }
}
/** https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve */
function randnBM(min, max, skew) {
    let u = 0;
    let v = 0;
    while (u === 0) {
        u = Math.random();
    } // Converting [0,1) to (0,1)
    while (v === 0) {
        v = Math.random();
    }
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
        num = randnBM(min, max, skew);
    } // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}
function randnArray(array) {
    for (let i = 0; i < array.length; i++) {
        array[i] = randnBM(Xmin, Xmax, Xskew);
    }
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
}
function createUI() {
    const sliderXsize = document.getElementById("sliderXsize");
    sliderXsize.addEventListener("input", (event) => {
        const slider = event.target;
        randXSize = randXSizeList[slider.value];
    });
    sliderXsize.addEventListener("change", (event) => {
        init();
    });
    sliderXsize.getAriaValueText = () => {
        return randXSize.toString();
    };
    const sliderXrange = document.getElementById("sliderXrange");
    sliderXrange.addEventListener("input", (event) => {
        const slider = event.target;
        Xmin = slider.name === "min" ? slider.value : Xmin;
        Xmax = slider.name === "max" ? slider.value : Xmax;
    });
    const sliderYscale = document.getElementById("sliderYscale");
    sliderYscale.addEventListener("input", (event) => {
        const slider = event.target;
        scaleY = slider.value;
    });
    const sliderBinNumber = document.getElementById("sliderBinNumber");
    sliderBinNumber.addEventListener("input", (event) => {
        const slider = event.target;
        numBins = binSizeNumber[slider.value];
        init();
    });
    sliderBinNumber.getAriaValueText = () => {
        return numBins.toString();
    };
    const sliderSkew = document.getElementById("sliderSkew");
    sliderSkew.addEventListener("input", (event) => {
        const slider = event.target;
        Xskew = slider.value;
    });
}
//# sourceMappingURL=histogram.js.map