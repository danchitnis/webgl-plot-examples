

import * as noUiSlider from "nouislider";

import { ColorRGBA, WebglPolar, WebGLplot, WebglLine} from "./webglplot/webglplot"


import * as Statsjs from "stats.js";



let amp = 0.5;
let noise  = 0.1;
let freq = 0.01;

let preR = 0.5;

const canv =  document.getElementById("my_canvas") as HTMLCanvasElement;

let fpsDivder = 1;
let fpsCounter = 0;

let indexNow = 0;

let numPoints = 100;

let segView = false;

let wglp: WebGLplot;
let line: WebglPolar;
let line2: WebglPolar;
const lineColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);

const lineNumList = [3, 4, 5, 6, 7, 8, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let sliderLines: noUiSlider.Instance;
let sliderFreq: noUiSlider.Instance;
let sliderAmp: noUiSlider.Instance;
let sliderNoise: noUiSlider.Instance;

let displayLines: HTMLSpanElement;
let displayFreq: HTMLSpanElement;
let displayAmp: HTMLSpanElement;
let displayNoise: HTMLSpanElement;

const stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );


let resizeId: number;
window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 100);
});

let timer = setInterval( () => {
  update();
}, noise*10);

createUI();

init();



/****************************************/

function newFrame(): void {

  if (fpsCounter===0) {
    stats.begin();

  //update();

  wglp.update();
  //wglp.gScaleY = scaleY;

  stats.end();

  
  }
  fpsCounter++;

  if (fpsCounter >= fpsDivder) {
    fpsCounter = 0;
  }

  window.requestAnimationFrame(newFrame);
  
}

window.requestAnimationFrame(newFrame);



function init(): void {

  const devicePixelRatio = window.devicePixelRatio || 1;
  const numX = Math.round(canv.clientWidth * devicePixelRatio);
  const numY = Math.round(canv.clientHeight * devicePixelRatio);

  line = new WebglPolar(lineColor, numPoints);
  line.loop = true;

  line2 = new WebglPolar(new ColorRGBA(0.9,0.9,0.9,1), 2);
  line2.xy = new Float32Array([0,0,1,1]);



  wglp = new WebGLplot(canv);

  //wglp.offsetX = -1;
  wglp.gScaleX = numY/numX;
  wglp.gScaleY = 1;




  //line.linespaceX(-1, 2  / numX);
  wglp.addLine(line);
  wglp.addLine(line2);

  for (let i=0; i < line.numPoints; i++) {
    const theta = i * 360 / line.numPoints;
    const r = amp * 1;
    //const r = 1;
    line.setRtheta(i, theta, r);

  }

}

function update(): void {

  //line.offsetTheta = 10*noise;

  //preR form previous update

  if (indexNow < line.numPoints) {
    const theta = indexNow * 360 / line.numPoints;
    let r = amp * (Math.random()-0.5) + preR;
    line.setRtheta(indexNow, theta, r);

    line2.setRtheta(0, 0, 0);
    line2.setRtheta(1, theta, 1);
    
    //line2.setX(1,line.getX(indexNow));
    //line2.setY(1,line.getY(indexNow));

    r = (r<1)?r:1;
    r = (r>0)?r:0;
    preR = r;

    indexNow++;
  } else {
    indexNow = 0;
  }
  

}


function doneResizing(): void {
  wglp.viewport(0, 0, canv.width, canv.height);
  init();
}


/*function changeView(): void {
  if (segView) {

      lines[i].offsetY = 0;
      lines[i].scaleY = 1
    }
    segView = false;
  }
  else {
    for (let i=0; i<lines.length; i++) {
      lines[i].offsetY = 1.5*(i/lines.length - 0.5);
      lines[i].scaleY = 1.5 / lines.length;
    }
    segView = true;
  }
  
  
}*/


function createUI(): void {
  const ui =  document.getElementById("ui") as HTMLDivElement;

  // ******slider lines */
  sliderLines =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderLines.style.width = "100%";
  noUiSlider.create(sliderLines, {
    start: [2],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: lineNumList.length,
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


  // ******slider Freq */
  sliderFreq =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderFreq.style.width = "100%";
  noUiSlider.create(sliderFreq, {
    start: [1],
    step: 0.01,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 3,
    },
  });

  displayFreq = document.createElement("span");
  ui.appendChild(sliderFreq);
  ui.appendChild(displayFreq);
  ui.appendChild(document.createElement("p"));

  sliderFreq.noUiSlider.on("update", (values, handle) => {
    const k = 1;
    freq = k * parseFloat(values[handle]);
    displayFreq.innerHTML = `Frequency: ${freq / k}`;
  });


  // ******slider amp */
  sliderAmp =  document.createElement("div") as unknown as noUiSlider.Instance;
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
    displayAmp.innerHTML = `Signal Amplitude: ${amp / k}`;
  });



  // ******slider noise */
  sliderNoise =  document.createElement("div") as unknown as noUiSlider.Instance;
  sliderNoise.style.width = "100%";
  noUiSlider.create(sliderNoise, {
    start: [1],
    step: 1,
    connect: [true, false],
    // tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 1,
      max: 100,
    },
  });

  displayNoise = document.createElement("span");
  ui.appendChild(sliderNoise);
  ui.appendChild(displayNoise);
  ui.appendChild(document.createElement("p"));

  sliderNoise.noUiSlider.on("update", (values, handle) => {
    const k = 1;
    noise = k * parseFloat(values[handle]);
    //fpsDivder = k * parseFloat(values[handle]);
    displayNoise.innerHTML = `Noise Amplitude: ${noise / k}`;
    clearInterval(timer);
    timer = setInterval( update, noise);
  });


  const btView = document.createElement("button");
  btView.className = "button";
  btView.innerHTML = "Change View"
  ui.appendChild(btView);
  btView.addEventListener("click", () => {
    //changeView();
  });

}
