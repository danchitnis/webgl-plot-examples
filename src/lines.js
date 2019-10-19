"use strict";
exports.__esModule = true;
var webGLplot_1 = require("./webGLplot");
var webGLplot_2 = require("./webGLplot");
var webGLplot_3 = require("./webGLplot");
var noUiSlider = require("nouislider");
var Statsjs = require("stats.js");
var line_num = 1;
var canv = document.getElementById("my_canvas");
var devicePixelRatio = window.devicePixelRatio || 1;
var num = Math.round(canv.clientWidth * devicePixelRatio);
var yscale = 1;
var fps_divder = 1;
var fps_counter = 0;
var wglp;
var line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
var slider_lines;
var display_lines;
var stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);
createUI();
init();
var resizeId;
window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});
function new_frame() {
    if (fps_counter == 0) {
        stats.begin();
        wglp.linegroups.forEach(function (line) {
            var k = 2 * Math.random() - 1;
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
    wglp = new webGLplot_1.webGLplot(canv);
    for (var i = 0; i < line_num; i++) {
        var color = new webGLplot_2.color_rgba(Math.random(), Math.random(), Math.random(), 1);
        var line = new webGLplot_3.lineGroup(color, num);
        line.linespaceX();
        wglp.add_line(line);
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
    slider_lines.noUiSlider.on("update", function (values, handle) {
        line_num = line_num_list[parseFloat(values[handle])];
        display_lines.innerHTML = "Line number: " + line_num;
    });
    slider_lines.noUiSlider.on("set", function (values, handle) {
        init();
    });
}
