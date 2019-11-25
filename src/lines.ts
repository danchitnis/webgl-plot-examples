

import * as noUiSlider from "nouislider";
import { ColorRGBA, WebglLine, WebGLplot} from "webgl-plot";

import Statsjs = require("stats.js");



let numLines = 1;



const canv =  document.getElementById("my_canvas") as HTMLCanvasElement;

const devicePixelRatio = window.devicePixelRatio || 1;
const num = Math.round(canv.clientWidth * devicePixelRatio);

const scaleY = 1;

let fpsDivder = 1;
let fpsCounter = 0;


let wglp: WebGLplot;
let lines: WebglLine[];

let lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let sliderLines: noUiSlider.Instance;

let displayLines: HTMLSpanElement;

const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );

createUI();

init();


let resizeId: number;
window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});



function new_frame() {


  if (fpsCounter === 0) {

    stats.begin();

    lines.forEach((line) => {
      const k = 2 * Math.random() - 1;
      line.constY(k);

    });

    wglp.update();
    wglp.scaleY = scaleY;

    stats.end();

  }

  fpsCounter++;

  if (fpsCounter >= fpsDivder) {
    fpsCounter = 0;
  }

  window.requestAnimationFrame(new_frame);
}

window.requestAnimationFrame(new_frame);



function init() {
  lines = [];

  for (let i = 0; i < numLines; i++) {
    const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
    lines.push(new WebglLine(color, num));
  }

  wglp = new WebGLplot(canv);


  lines.forEach((line) => {
    line.linespaceX();
    wglp.add_line(line);
  });
}


function doneResizing() {
  wglp.viewport(0, 0, canv.width, canv.height);
  console.log(window.innerWidth);
}



function createUI() {
  const ui =  document.getElementById("ui") as HTMLDivElement;

  // ******slider lines */
  sliderLines =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderLines.style.width = "100%";
  noUiSlider.create(sliderLines, {
    start: [0],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 11,
    },
  });

  displayLines = document.createElement("span");
  ui.appendChild(sliderLines);
  ui.appendChild(displayLines);
  ui.appendChild(document.createElement("p"));

  sliderLines.noUiSlider.on("update", (values, handle) => {
    numLines = lineNumList[parseFloat(values[handle])];
    displayLines.innerHTML = `Line number: ${numLines}`;
  });

  sliderLines.noUiSlider.on("set", (values, handle) => {
    init();
  });


}
