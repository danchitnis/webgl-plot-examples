import WebGLplot, { ColorRGBA, WebglLine } from "webgl-plot";
import * as Statsjs from "stats.js";
const canv = document.getElementById("my_canvas");
const player = document.getElementById("player");
const camera = document.getElementById("camera");
const context = camera.getContext("2d");
let numX;
let segView = false;
let wglp;
let lineR;
let lineG;
let lineB;
const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);
createUI();
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    stats.begin();
    update();
    wglp.update();
    //wglp.gScaleY = scaleY;
    stats.end();
    window.requestAnimationFrame(newFrame);
}
window.requestAnimationFrame(newFrame);
function init() {
    // Create the canvas and get a context
    // Set the canvas to be the same size as the original image
    // Draw the image onto the top-left corner of the canvas
    var handleSuccess = function (stream) {
        player.srcObject = stream;
    };
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(handleSuccess);
    player.height = 0;
    player.width = 0;
    camera.width = 4 * 100;
    camera.height = 3 * 100;
    let imageData = 0;
    let pixels = 0;
    const devicePixelRatio = window.devicePixelRatio || 1;
    //numX = Math.round(canv.clientWidth * devicePixelRatio);
    numX = camera.width;
    lineR = new WebglLine(new ColorRGBA(0.9, 0.2, 0.2, 1), numX);
    lineG = new WebglLine(new ColorRGBA(0.2, 0.9, 0.2, 1), numX);
    lineB = new WebglLine(new ColorRGBA(0.2, 0.2, 0.9, 1), numX);
    wglp = new WebGLplot(canv);
    wglp.gOffsetY = -1;
    lineR.lineSpaceX(-1, 2 / numX);
    lineG.lineSpaceX(-1, 2 / numX);
    lineB.lineSpaceX(-1, 2 / numX);
    wglp.addLine(lineR);
    wglp.addLine(lineG);
    wglp.addLine(lineB);
}
function update() {
    context.drawImage(player, 0, 0, camera.width, camera.height);
    const imageData = context.getImageData(0, 0, camera.width, camera.height);
    const pixels = imageData.data;
    let i = 0;
    let j = 0;
    //for (j=0; j<camera.height; j++) {
    for (i = 0; i < camera.width; i++) {
        const r = pixels[(100 * camera.width + i) * 4];
        const g = pixels[(100 * camera.width + i) * 4 + 1];
        const b = pixels[(100 * camera.width + i) * 4 + 2];
        lineR.setY(i, r / 255);
        lineG.setY(i, g / 255);
        lineB.setY(i, b / 255);
    }
    //}
    //line.setY(i / 4, pixels[i] / 255);
}
function doneResizing() {
    wglp.viewport(0, 0, canv.width, canv.height);
}
function createUI() {
    const ui = document.getElementById("ui");
}
//# sourceMappingURL=camera.js.map