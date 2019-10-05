
import ndarray = require("ndarray");
import { webGLplot} from "./webGLplot"
import { color_rgba} from "./webGLplot"
import { lineGroup } from "./webGLplot"
import * as noUiSlider from 'nouislider';


import { SPAD } from "./spad";




let N = 1000;
let phrate = 10;
let tr = 0.02;
let vth = 0.5;


let line_num = 100;

let flag_vth = false;

let flag_CH1 = true;
let flag_CH2 = false;

let run_single = false;

let update_new_ph = true;
let update_ch1 = true;
let update_ch2 = false;

let canv = <HTMLCanvasElement>document.getElementById("display");

let devicePixelRatio = window.devicePixelRatio || 1;
let num = Math.round(canv.clientWidth * devicePixelRatio);

let yscale = 1;

let fps_divder = 1;
let fps_counter = 0;


let wglp = new webGLplot(canv);


wglp.clear();

for (let i=0;i<line_num;i++) {
  let color = new color_rgba(Math.random(),Math.random(),Math.random(),1);
  let line = new lineGroup(color, 1000);
  line.linespaceX();
  wglp.add_line(line);
}









//gr.polyline(1000, tplot, yplot);

let slider_tr = document.getElementById('slider_tr') as noUiSlider.Instance;
let slider_phrate = document.getElementById("slider_phrate") as noUiSlider.Instance;;
let slider_vth = document.getElementById("slider_vth") as noUiSlider.Instance;;

noUiSlider.create(slider_tr, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 1
    }
});
  
noUiSlider.create(slider_phrate, {
    start: [10],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.1,
      max: 100
    }
});
  
  //slider_vth.style.visibility = "hidden";
slider_vth.setAttribute("disabled", "true");
noUiSlider.create(slider_vth, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 1
    }
});



update_ui();

let spad = new SPAD(1000);
let tplot = spad.t.tolist();

function new_frame() {
  

  if (fps_counter==0) {
    
    wglp.linegroups.forEach(line => {
      let k = 2*Math.random()-1;
      line.constY(k);

    });
    
    wglp.clear();
    wglp.update_add();

    wglp.scaleY = yscale;

  }

  fps_counter++;

  if (fps_counter >= fps_divder) {
    fps_counter = 0;
  }
  
  window.requestAnimationFrame(new_frame);
}

window.requestAnimationFrame(new_frame);
  





slider_tr.noUiSlider.on("update", function(values, handle) {
  tr = parseFloat(values[handle]) / 10;
  (<HTMLParagraphElement>document.getElementById("display_tr")).innerHTML = tr.toString();
  //run_single = true;
});

slider_phrate.noUiSlider.on("update", function(values, handle) {
  phrate = parseFloat(values[handle]);
  (<HTMLParagraphElement>document.getElementById("display_phrate")).innerHTML = phrate.toString();
  spad.generate_photon(phrate);
  //run_single = true;
});

slider_vth.noUiSlider.on("update", function(values, handle) {
  vth = parseFloat(values[handle]);
  (<HTMLParagraphElement>document.getElementById("display_vth")).innerHTML = vth.toString();
});

slider_tr.noUiSlider.on("start", function(values, handle) {slider_start();});
slider_tr.noUiSlider.on("end", function(values, handle) {slider_end();});
slider_phrate.noUiSlider.on("start", function(values, handle) {slider_start();});
slider_phrate.noUiSlider.on("end", function(values, handle) {slider_end();});

slider_vth.noUiSlider.on("start", function(values, handle) {
  flag_vth = true;
  if (run_single) {
    update_ch1=false;
    update_ch2 = true;
  }
});
 

slider_vth.noUiSlider.on("end", function(values, handle) {
  flag_vth = false;
  slider_end();
});


function slider_start():void {
  update_ch1 = true;
  update_ch2 = true;
}

function slider_end():void {
  if (run_single) {
    update_ch1 = false;
    update_ch2 = false;
  }
}



//plot new set

function update(new_photon:boolean, ch1:boolean, ch2:boolean): void {
  if (new_photon) {
    spad.generate_photon(phrate);
  }

  //gr.clearws();
  
  if (ch1) {
    spad.update_y(tr);
  }

  if (flag_CH1) {
    //gr.setlinecolorind(430);
    //gr.polyline(1000, tplot, spad.y.tolist());
  }


  if (ch2) {
    spad.update_ysq(vth);
  }
  if (flag_CH2) {
    //gr.setlinecolorind(530);
    //gr.polyline(1000, tplot, spad.ysq.tolist());
    if (flag_vth) {
      //let y = (nj.ones(1000)).multiply(vth);
      //gr.setlinecolorind(550);
      //gr.polyline(1000, tplot, y.tolist());
    }
  }

}



function update_ui():void {
  if (update_new_ph) {
    (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "green";
  }
  else {
    (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "";
  }

  if (flag_CH1) {
    (<HTMLButtonElement>document.getElementById("btCH1")).style.backgroundColor = "yellow";
  }
  else {
    (<HTMLButtonElement>document.getElementById("btCH1")).style.backgroundColor = "";
  }

  if (flag_CH2) {
    (<HTMLButtonElement>document.getElementById("btCH2")).style.backgroundColor = "green";
  }
  else {
    (<HTMLButtonElement>document.getElementById("btCH2")).style.backgroundColor = "";
  }
}


//button function
function ctrl_run():void {
  run_single = false;
  update_new_ph = true;
  update_ch1 = true;
  update_ch2 = true;
  (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "green";
  (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "";
}

function ctrl_single():void {
  run_single = true;
  update_new_ph = false;
  update_ch1 = false;
  update_ch2 = false;
  update(true, true, true);


  (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "green";
  (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "";
  setTimeout(function() {
    (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "";
    (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "red";
  }, 200);
  
  
}

// CH functions

function btCH1() {
  let bt = <HTMLButtonElement>document.getElementById("btCH1");
  if (flag_CH1) {
    flag_CH1 = false;
    bt.style.backgroundColor = "";
  } else {
    flag_CH1 = true;
    bt.style.backgroundColor = "Yellow";
  }
}

function btCH2() {
  let bt = <HTMLButtonElement>document.getElementById("btCH2");
  if (flag_CH2) {
    flag_CH2 = false;
    slider_vth.setAttribute("disabled", "true");
    bt.style.backgroundColor = "";
  } else {
    flag_CH2 = true;
    slider_vth.removeAttribute("disabled");
    bt.style.backgroundColor = "lightgreen";
  }
}