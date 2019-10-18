"use strict";
/**
 * Author Danial Chitnis 2019
 */
exports.__esModule = true;
var webgl_plot_1 = require("webgl-plot");
var webgl_plot_2 = require("webgl-plot");
var webgl_plot_3 = require("webgl-plot");
var noUiSlider = require("nouislider");
var brown_1 = require("./brown");
var Statsjs = require("stats.js");
var b = new brown_1.brown();
var canv = document.getElementById("my_canvas");
var devicePixelRatio = window.devicePixelRatio || 1;
var num = Math.round(canv.clientWidth * devicePixelRatio);
//let num=1000;
var stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);
var line_num = 100;
var yscale = 1;
var line_colors;
var lines;
var wglp;
var fps_divder = 1;
var fps_counter = 0;
// new data per frame
var new_num = 1;
var line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
var slider_lines;
var slider_yscale;
var slider_new_data;
var slider_fps;
var display_lines;
var display_yscale;
var display_new_data_size;
var display_fps;
createUI();
//sliders
/**/
/*;








 

 

 */
var resizeId;
window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});
var bt = document.getElementById("bt");
bt.addEventListener("click", btclick);
init();
function new_frame() {
    if (fps_counter == 0) {
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
function plot(shift_size) {
    lines.forEach(function (line) {
        var y_array = random_walk(line.getY(num - 1), shift_size);
        line.shift_add(y_array);
    });
}
function random_walk(init, walk_size) {
    var y = new Float32Array(walk_size);
    y[0] = init + 0.01 * (Math.round(Math.random()) - 0.5);
    for (var i = 1; i < walk_size; i++) {
        y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
    }
    return y;
}
function init() {
    line_colors = [];
    lines = [];
    for (var i = 0; i < line_num; i++) {
        line_colors.push(new webgl_plot_2.color_rgba(Math.random(), Math.random(), Math.random(), 0.5));
        lines.push(new webgl_plot_3.lineGroup(line_colors[i], num));
    }
    wglp = new webgl_plot_1.webGLplot(canv);
    lines.forEach(function (line) {
        wglp.add_line(line);
    });
    console.log(num);
    for (var i = 0; i < num; i++) {
        //set x to -num/2:1:+num/2
        lines.forEach(function (line) {
            line.linespaceX();
        });
    }
}
function doneResizing() {
    wglp.viewport(0, 0, canv.width, canv.height);
    console.log(window.innerWidth);
}
function createUI() {
    var ui = document.getElementById("ui");
    //******slider lines */
    slider_lines = document.createElement("div");
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
    slider_lines.noUiSlider.on("update", function (values, handle) {
        line_num = line_num_list[parseFloat(values[handle])];
        display_lines.innerHTML = "Line number: " + line_num;
        line_num.toString();
    });
    slider_lines.noUiSlider.on("set", function (values, handle) {
        init();
    });
    /*****slider yscale */
    slider_yscale = document.createElement("div");
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
    slider_yscale.noUiSlider.on("update", function (values, handle) {
        yscale = parseFloat(values[handle]);
        display_yscale.innerHTML = "Y scale = " + yscale;
    });
    /****** slider new data */
    slider_new_data = document.createElement("div");
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
    slider_new_data.noUiSlider.on("update", function (values, handle) {
        new_num = parseFloat(values[handle]);
        display_new_data_size.innerHTML = "New data per frame = " + new_num;
    });
    /**** slider fps */
    slider_fps = document.createElement("div");
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
    slider_fps.noUiSlider.on("update", function (values, handle) {
        fps_divder = parseFloat(values[handle]);
        display_fps.innerHTML = "FPS  = " + (60 / fps_divder);
    });
}
function btclick() {
    console.log("button press!");
    var ui = document.getElementById("ui");
    while (ui.firstChild) {
        ui.removeChild(ui.firstChild);
    }
}
