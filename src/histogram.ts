

import { webGLplot} from "webgl-plot"
import { color_rgba} from "webgl-plot"
import { lineGroup } from "webgl-plot"
import * as noUiSlider from 'nouislider';

import Statsjs = require("stats.js");



let line_num = 1;



let canv = <HTMLCanvasElement>document.getElementById("my_canvas");

let devicePixelRatio = window.devicePixelRatio || 1;
//let num = Math.round(canv.clientWidth * devicePixelRatio);

let yscale = 1;

let fps_divder = 1;
let fps_counter = 0;


let wglp: webGLplot;
let line: lineGroup;

let line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let slider_lines: noUiSlider.Instance;

let display_lines: HTMLSpanElement;

let stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );

let num_bins = 100;

createUI();

init();

let X = new Float32Array(10000);
randn_array(X);
//console.log(X);

let xbins = new Float32Array(num_bins);
for (let i = 0; i < xbins.length; i++) {
  xbins[i] = 0;
  
}

for (let i = 0; i < X.length; i++) {
  let bin = Math.floor(X[i]);
  xbins[bin]++;
}

console.log(xbins);


for (let i = 0; i < xbins.length; i++) {
  line.setY(i,xbins[i]/1000);
}

wglp.update();



let resizeId: number;
window.addEventListener('resize', function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});



function new_frame() {
  

  if (fps_counter==0) {
    
    stats.begin();
    
    randn_array(X);

    for (let i = 0; i < xbins.length; i++) {
      xbins[i] = 0;
      
    }
    
    for (let i = 0; i < X.length; i++) {
      let bin = Math.floor(X[i]);
      xbins[bin]++;
    }
    
    for (let i = 0; i < xbins.length; i++) {
      line.setY(i,xbins[i]/1000);
    }
    wglp.update();

    stats.end();

  }

  fps_counter++;

  if (fps_counter >= fps_divder) {
    fps_counter = 0;
  }
  
  window.requestAnimationFrame(new_frame);
}

window.requestAnimationFrame(new_frame);
  


function init() {
  wglp = new webGLplot(canv);

  
    let color = new color_rgba(1, 1, 0, 0.5);
    line = new lineGroup(color, num_bins);
    line.linespaceX();
    wglp.add_line(line);
  
}

/** https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve */
function randn_bm(min:number, max:number, skew:number):number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}


function randn_array(array:Float32Array) {
  for (let i=0;i<array.length;i++) {
    array[i] = randn_bm(0,num_bins,1);
  }
}













function doneResizing() {
  wglp.viewport(0, 0, canv.width, canv.height);
  console.log(window.innerWidth);
}



function createUI() {
  let ui = <HTMLDivElement>document.getElementById("ui");
  
  //******slider lines */
  slider_lines = <unknown>document.createElement("div") as noUiSlider.Instance;
  slider_lines.style.width = "100%";
  noUiSlider.create(slider_lines, {
    start: [0],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0,
      max: 11
    }
  });

  display_lines = document.createElement("span");
  ui.appendChild(slider_lines);
  ui.appendChild(display_lines);
  ui.appendChild(document.createElement("p"));

  slider_lines.noUiSlider.on("update", function(values, handle) {
    line_num = line_num_list[parseFloat(values[handle])];
    display_lines.innerHTML = `Line number: ${line_num}`;
  });

  slider_lines.noUiSlider.on("set", function(values, handle) {
    init();
  });


}
