

import { webGLplot} from "./webGLplot"
import { color_rgba} from "./webGLplot"
import { lineGroup } from "./webGLplot"
import * as noUiSlider from 'nouislider';

import Statsjs = require("stats.js");



let line_num = 1;



let canv = <HTMLCanvasElement>document.getElementById("my_canvas");

let devicePixelRatio = window.devicePixelRatio || 1;
let num = Math.round(canv.clientWidth * devicePixelRatio);

let yscale = 1;

let fps_divder = 1;
let fps_counter = 0;


let wglp: webGLplot;

let line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let slider_lines: noUiSlider.Instance;

let display_lines: HTMLSpanElement;

let stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );

createUI();

init();


let resizeId;
window.addEventListener('resize', function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});



function new_frame() {
  

  if (fps_counter==0) {
    
    stats.begin();
    
    wglp.linegroups.forEach(line => {
      let k = 2*Math.random()-1;
      line.constY(k);

    });
    
    wglp.update();
    wglp.scaleY = yscale;

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

  for (let i=0;i<line_num;i++) {
    let color = new color_rgba(Math.random(),Math.random(),Math.random(),1);
    let line = new lineGroup(color, num);
    line.linespaceX();
    wglp.add_line(line);
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
