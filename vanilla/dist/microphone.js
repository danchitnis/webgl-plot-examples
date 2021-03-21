import { WebglPlot, ColorRGBA, WebglLine } from "https://cdn.skypack.dev/webgl-plot";
const canvas = document.getElementById("my_canvas");
const player = document.getElementById("player");
let numX;
let analyser;
let wglp;
let lineTime;
let lineFreq;
const fftSize = Math.pow(2, 14);
const maxA = new Array(60 * 2);
//createUI();
init();
let resizeId;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(doneResizing, 500);
});
function newFrame() {
    if (analyser != undefined) {
        update();
    }
    wglp.update();
    //wglp.gScaleY = scaleY;
    window.requestAnimationFrame(newFrame);
}
window.requestAnimationFrame(newFrame);
function init() {
    // Create the canvas and get a context
    // Set the canvas to be the same size as the original image
    // Draw the image onto the top-left corner of the canvas
    const handleSuccess = function (stream) {
        player.srcObject = stream;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(1024, 1, 1);
        analyser = context.createAnalyser();
        analyser.fftSize = fftSize;
        const bufferLength = analyser.frequencyBinCount;
        console.log(analyser.frequencyBinCount);
        const dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);
        //source.connect(processor);
        //processor.connect(context.destination);
        processor.onaudioprocess = () => {
            // Do something with the data, e.g. convert it to WAV
            //console.log(e.inputBuffer);
            //analyser.getByteTimeDomainData(dataArray);
            analyser.getByteFrequencyData(dataArray);
            //const buffer = e.inputBuffer.getChannelData(0);
            for (let i = 0; i < dataArray.length; i++) {
                //line.setY(i, buffer[i]);
                lineFreq.setY(i, dataArray[i] / 255);
            }
            //console.log(dataArray);
        };
    };
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
    player.height = 0;
    player.width = 0;
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    numX = 1024;
    lineTime = new WebglLine(new ColorRGBA(0.2, 0.9, 0.2, 1), numX);
    lineFreq = new WebglLine(new ColorRGBA(0.9, 0.2, 0.2, 1), fftSize / 2);
    wglp = new WebglPlot(canvas);
    wglp.gOffsetY = 0;
    lineTime.offsetY = 0;
    lineTime.lineSpaceX(-1, 2 / numX);
    lineFreq.lineSpaceX(-1, 2 / numX);
    lineFreq.offsetY = -1;
    lineFreq.scaleY = 2;
    lineFreq.offsetX = -1;
    wglp.addLine(lineTime);
    wglp.addLine(lineFreq);
}
function update() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const maxF = Math.max(...dataArray);
    for (let i = 0; i < dataArray.length; i++) {
        //line.setY(i, buffer[i]);
        lineFreq.setY(i, dataArray[i] / maxF);
        lineFreq.setX(i, Math.log10(i) / 2);
        //max = Math.max(buffer.);
    }
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);
    maxA.shift();
    maxA.push(Math.max(...buffer));
    const maxAcurrent = Math.max(...maxA);
    for (let i = 0; i < buffer.length; i++) {
        lineTime.setY(i, buffer[i] / maxAcurrent);
    }
}
function doneResizing() {
    //wglp.viewport(0, 0, canv.width, canv.height);
    init();
}
/*function createUI(): void {
  const ui = document.getElementById("ui") as HTMLDivElement;
}*/
//# sourceMappingURL=microphone.js.map