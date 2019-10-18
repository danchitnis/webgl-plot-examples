/**
 * Author Danial Chitnis 2019
 */

import { webGLplot} from 'webgl-plot'
import { color_rgba} from 'webgl-plot'
import { lineGroup } from 'webgl-plot'
import * as noUiSlider from 'nouislider';

import {brown} from './brown';

import Statsjs = require("stats.js");


let b = new brown();

let canv = <HTMLCanvasElement>document.getElementById("my_canvas");


let devicePixelRatio = window.devicePixelRatio || 1;
let num = Math.round(canv.clientWidth * devicePixelRatio);
//let num=1000;

let stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild( stats.dom );



let line_num = 100;
let yscale = 1;
let line_colors : Array<color_rgba>;
let lines : Array<lineGroup>;

let wglp:webGLplot;

let fps_divder = 1; 
let fps_counter = 0;

// new data per frame
let new_num = 1;


let line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

let slider_lines: noUiSlider.Instance;
let slider_yscale: noUiSlider.Instance;
let slider_new_data: noUiSlider.Instance;
let slider_fps: noUiSlider.Instance;

let display_lines: HTMLSpanElement;
let display_yscale: HTMLSpanElement;
let display_new_data_size: HTMLSpanElement;
let display_fps: HTMLSpanElement;

createUI();


//sliders


/**/

/*;








 

 

 */

let resizeId;
 window.addEventListener('resize', function() {
     clearTimeout(resizeId);
     resizeId = setTimeout(doneResizing, 500);
 });

let bt = <HTMLButtonElement>document.getElementById("bt");
bt.addEventListener("click",btclick);

 init();



function new_frame() {
  

  if (fps_counter==0) {
    stats.begin();

    plot(new_num);

    wglp.scaleY = yscale;
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



function plot(shift_size:number) {
  
  lines.forEach(line => {
    let y_array = random_walk(line.getY(num-1), shift_size);
    line.shift_add(y_array);
  });

}


function random_walk(init:number, walk_size:number):Float32Array {
  let y = new Float32Array(walk_size);
  y[0] = init + 0.01 * (Math.round(Math.random()) -0.5);
  for (let i=1; i<walk_size;i++) {
    y[i] = y[i-1] + 0.01 * (Math.round(Math.random()) -0.5);
  }
  return y;
}


function init() {
  line_colors = [];
  lines = [];

  for(let i = 0; i < line_num; i++) {
    line_colors.push(new color_rgba(Math.random(), Math.random(), Math.random(), 0.5));
    lines.push(new lineGroup(line_colors[i], num));
  }

  wglp = new webGLplot(canv);

  
  lines.forEach(line => {
    wglp.add_line(line);
  });



  console.log(num);


  for (let i=0; i<num; i++) {
    //set x to -num/2:1:+num/2
    lines.forEach(line => {
      line.linespaceX();
    });
  }

}

function doneResizing() {
  wglp.viewport(0, 0, canv.width, canv.height);
  console.log(window.innerWidth);
}

function createUI() {
  let ui = <HTMLDivElement>document.getElementById("ui");
  
  //******slider lines */
  slider_lines = document.createElement("div") as noUiSlider.Instance;
  slider_lines.style = "width: 100%";
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
    line_num.toString();
  });

  slider_lines.noUiSlider.on("set", function(values, handle) {
    init();
  });



  /*****slider yscale */
  slider_yscale = document.createElement("div") as noUiSlider.Instance;
  slider_yscale.style = "width: 100%";
  noUiSlider.create(slider_yscale, {
    start: [1],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 10
    }
  });

  display_yscale = document.createElement("span");
  ui.appendChild(slider_yscale);
  ui.appendChild(display_yscale);
  ui.appendChild(document.createElement("p"));

  slider_yscale.noUiSlider.on("update", function(values, handle) {
    yscale = parseFloat(values[handle]);
    display_yscale.innerHTML = `Y scale = ${yscale}`;
  });

  /****** slider new data */
  slider_new_data = document.createElement("div") as noUiSlider.Instance;
  slider_new_data.style = "width: 100%";
  
  noUiSlider.create(slider_new_data, {
    start: [1],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 1,
      max: 100
    }
  });

  display_new_data_size = document.createElement("span");
  ui.appendChild(slider_new_data);
  ui.appendChild(display_new_data_size);
  ui.appendChild(document.createElement("p"));

  slider_new_data.noUiSlider.on("update", function(values, handle) {
    new_num = parseFloat(values[handle]);
    display_new_data_size.innerHTML = `New data per frame = ${new_num}`;
  });

  /**** slider fps */
  slider_fps = document.createElement("div") as noUiSlider.Instance;
  slider_fps.style = "width: 100%";

  noUiSlider.create(slider_fps, {
    start: [1],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 1,
      max: 10
    }
  });

  display_fps = document.createElement("span");
  ui.appendChild(slider_fps);
  ui.appendChild(display_fps);
  ui.appendChild(document.createElement("p"));
  
  slider_fps.noUiSlider.on("update", function(values, handle) {
    fps_divder = parseFloat(values[handle]);
    display_fps.innerHTML = `FPS  = ${(60/fps_divder)}`;
  });

}

function btclick() {
  console.log("button press!");
  let ui = <HTMLDivElement>document.getElementById("ui");
  while (ui.firstChild) {
    ui.removeChild(ui.firstChild);
  }
}

