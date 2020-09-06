(function () {
    'use strict';

    /**
     * Simple Slide
     *
     * by Danial Chitnis
     * Feb 2020
     */
    class SimpleSlider extends EventTarget {
        /**
         *
         * @param div - The id of the div which the slider is going to be placed
         * @param min - The minimum value for the slider
         * @param max - The maximum value for the slider
         * @param n - number of divisions within the value range, 0 for continuos
         *
         * @example
         * ```javascript
         * slider = new SimpleSlider("slider", 0, 100, 0);
         * ```
         */
        constructor(div, min, max, n) {
            super();
            this.sliderWidth = 0;
            this.handleOffset = 0;
            this.pxMin = 0;
            this.pxMax = 0;
            this.active = false;
            this.currentX = 0;
            this.initialX = 0;
            this.handlePos = 0;
            this.enable = true;
            /**
             * Current value of the slider
             * @default half of the value range
             */
            this.value = -1;
            /**
             * maximum value
             * @default 100
             */
            this.valueMax = 100;
            /**
             * minimum value for the slider
             * @default 0
             */
            this.valueMin = 0;
            /**
             * number of divisions in the value range
             * @default 0
             */
            this.valueN = 0;
            this.valueMax = max;
            this.valueMin = min;
            this.valueN = n;
            this.makeDivs(div);
            this.init();
            this.handleToCentre();
            this.divHandle.addEventListener("mousedown", (e) => {
                const x = e.clientX;
                if (this.enable) {
                    this.dragStart(x);
                }
            });
            this.divMain.addEventListener("mousemove", (e) => {
                const x = e.clientX;
                this.drag(e, x);
            });
            this.divMain.addEventListener("mouseup", () => {
                this.dragEnd();
            });
            this.divMain.addEventListener("mouseleave", () => {
                if (this.active) {
                    this.dragEnd();
                }
            });
            this.divBarL.addEventListener("mousedown", (e) => {
                if (this.enable) {
                    const x = e.clientX;
                    this.translateN(x);
                }
            });
            this.divBarR.addEventListener("mousedown", (e) => {
                if (this.enable) {
                    const x = e.clientX;
                    this.translateN(x);
                }
            });
            this.divHandle.addEventListener("touchstart", (e) => {
                const x = e.touches[0].clientX;
                this.dragStart(x);
            });
            this.divMain.addEventListener("touchmove", (e) => {
                const x = e.touches[0].clientX;
                this.drag(e, x);
            });
            this.divMain.addEventListener("touchend", () => {
                this.dragEnd();
            });
        }
        dragStart(x) {
            this.initialX = x - this.handlePos - this.handleOffset;
            this.active = true;
            this.dispatchEvent(new CustomEvent("drag-start"));
        }
        drag(e, x) {
            if (this.active) {
                e.preventDefault();
                this.currentX = x - this.initialX;
                this.translateN(this.currentX);
                this.value = this.getPositionValue();
                this.dispatchEvent(new CustomEvent("update"));
            }
        }
        dragEnd() {
            this.active = false;
            this.dispatchEvent(new CustomEvent("drag-end"));
        }
        /*-----------------------------------------------------------*/
        translateN(xPos) {
            this.translate(xPos);
            if (this.valueN > 0) {
                let val = this.getPositionValue();
                const step = (this.valueMax - this.valueMin) / (this.valueN - 1);
                val = Math.round(val / step) * step;
                this.setValue(val);
            }
        }
        translate(xPos) {
            this.handlePos = xPos - this.handleOffset;
            switch (true) {
                case this.handlePos < this.pxMin: {
                    this.handlePos = this.pxMin;
                    break;
                }
                case this.handlePos > this.pxMax: {
                    this.handlePos = this.pxMax;
                    break;
                }
                default: {
                    this.divHandle.style.left = (this.handlePos - this.handleOffset).toString() + "px";
                    this.divBarL.style.width = (this.handlePos - this.handleOffset).toString() + "px";
                }
            }
        }
        getPositionValue() {
            const innerValue = (this.handlePos - this.pxMin) / this.sliderWidth;
            return (this.valueMax - this.valueMin) * innerValue + this.valueMin;
        }
        /**
         * Sets the value of the slider on demand
         * @param val - the value of the slider
         */
        setValue(val) {
            const valRel = (val - this.valueMin) / (this.valueMax - this.valueMin);
            const newPos = valRel * this.sliderWidth + 2 * this.handleOffset;
            this.translate(newPos);
            this.value = this.getPositionValue();
            this.dispatchEvent(new CustomEvent("update"));
        }
        init() {
            const divMainWidth = parseFloat(getComputedStyle(this.divMain).getPropertyValue("width"));
            const handleWidth = parseFloat(getComputedStyle(this.divHandle).getPropertyValue("width"));
            const handlePad = parseFloat(getComputedStyle(this.divHandle).getPropertyValue("border-left-width"));
            this.handleOffset = handleWidth / 2 + handlePad;
            this.handlePos = parseFloat(getComputedStyle(this.divHandle).left) + this.handleOffset;
            this.divBarL.style.left = this.handleOffset.toString() + "px";
            this.divBarR.style.left = this.handleOffset.toString() + "px";
            this.sliderWidth = divMainWidth - 2 * this.handleOffset;
            this.divBarL.style.width = (this.handlePos - this.handleOffset).toString() + "px";
            this.divBarR.style.width = this.sliderWidth.toString() + "px";
            this.pxMin = this.handleOffset;
            this.pxMax = this.pxMin + this.sliderWidth;
            if (this.value == -1) {
                this.handleToCentre();
            }
            else {
                this.setValue(this.value);
            }
        }
        handleToCentre() {
            const centre = (this.valueMax - this.valueMin) / 2 + this.valueMin;
            this.setValue(centre);
        }
        /**
         * Resize the slider
         *
         * @example
         * ```javascript
         *  window.addEventListener("resize", () => {
         *    slider.resize();
         *  });
         * ```
         */
        resize() {
            this.init();
            this.setValue(this.value);
        }
        /**
         * Change the state of the slider
         * @param state enable state of the slider
         */
        setEnable(state) {
            this.enable = state;
            if (this.enable) {
                this.divHandle.style.backgroundColor = "darkslategrey";
                this.divBarL.style.backgroundColor = "lightskyblue";
                this.divBarR.style.backgroundColor = "lightgray";
            }
            else {
                this.divHandle.style.backgroundColor = "lightgray";
                this.divBarL.style.backgroundColor = "gray";
                this.divBarR.style.backgroundColor = "gray";
            }
        }
        /**
         * Sets the status of the debug mode
         * @param en - enable value true/false
         */
        setDebug(en) {
            if (en) {
                this.divHandle.style.zIndex = "0";
                this.divMain.style.border = "solid red 1px";
            }
            else {
                this.divHandle.style.zIndex = "2";
                this.divMain.style.border = "none";
            }
        }
        /**
         *
         * @param eventName
         * @param listener
         */
        addEventListener(eventName, listener) {
            super.addEventListener(eventName, listener);
        }
        makeDivs(mainDiv) {
            this.divMain = document.getElementById(mainDiv);
            this.divMain.className = "simple-slider";
            this.divHandle = document.createElement("div");
            this.divHandle.id = "handle";
            this.divHandle.className = "simple-slider-handle";
            this.divBarL = document.createElement("div");
            this.divBarL.id = "barL";
            this.divBarL.className = "simple-slider-barL";
            this.divBarR = document.createElement("div");
            this.divBarR.id = "barR";
            this.divBarR.className = "simple-slider-barR";
            this.divMain.append(this.divHandle);
            this.divMain.append(this.divBarL);
            this.divMain.append(this.divBarR);
        }
    }

    class ColorRGBA {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    /**
     * Baseline class
     */
    class WebglBaseLine {
        /**
         * @internal
         */
        constructor() {
            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.loop = false;
            this._vbuffer = 0;
            this._coord = 0;
            this.visible = true;
            this.intensity = 1;
        }
    }

    /**
     * The standard Line class
     */
    class WebglLine extends WebglBaseLine {
        /**
         * Create a new line
         * @param c - the color of the line
         * @param numPoints - number of data pints
         * @example
         * ```typescript
         * x= [0,1]
         * y= [1,2]
         * line = new WebglLine( new ColorRGBA(0.1,0.1,0.1,1), 2);
         * ```
         */
        constructor(c, numPoints) {
            super();
            this.webglNumPoints = numPoints;
            this.numPoints = numPoints;
            this.color = c;
            this.xy = new Float32Array(2 * this.webglNumPoints);
        }
        /**
         * Set the X value at a specific index
         * @param index - the index of the data point
         * @param x - the horizontal value of the data point
         */
        setX(index, x) {
            this.xy[index * 2] = x;
        }
        /**
         * Set the Y value at a specific index
         * @param index : the index of the data point
         * @param y : the vertical value of the data point
         */
        setY(index, y) {
            this.xy[index * 2 + 1] = y;
        }
        /**
         * Get an X value at a specific index
         * @param index - the index of X
         */
        getX(index) {
            return this.xy[index * 2];
        }
        /**
         * Get an Y value at a specific index
         * @param index - the index of Y
         */
        getY(index) {
            return this.xy[index * 2 + 1];
        }
        /**
         * Make an equally spaced array of X points
         * @param start  - the start of the series
         * @param stepSize - step size between each data point
         *
         * @example
         * ```typescript
         * //x = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8]
         * const numX = 10;
         * line.lineSpaceX(-1, 2 / numX);
         * ```
         */
        lineSpaceX(start, stepSize) {
            for (let i = 0; i < this.numPoints; i++) {
                // set x to -num/2:1:+num/2
                this.setX(i, start + stepSize * i);
            }
        }
        /**
         * Set a constant value for all Y values in the line
         * @param c - constant value
         */
        constY(c) {
            for (let i = 0; i < this.numPoints; i++) {
                // set x to -num/2:1:+num/2
                this.setY(i, c);
            }
        }
        /**
         * Add a new Y values to the end of current array and shift it, so that the total number of the pair remains the same
         * @param data - the Y array
         *
         * @example
         * ```typescript
         * yArray = new Float32Array([3, 4, 5]);
         * line.shiftAdd(yArray);
         * ```
         */
        shiftAdd(data) {
            const shiftSize = data.length;
            for (let i = 0; i < this.numPoints - shiftSize; i++) {
                this.setY(i, this.getY(i + shiftSize));
            }
            for (let i = 0; i < shiftSize; i++) {
                this.setY(i + this.numPoints - shiftSize, data[i]);
            }
        }
    }

    /**
     * Author Danial Chitnis 2019-20
     *
     * inspired by:
     * https://codepen.io/AzazelN28
     * https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
     */
    /**
     * The main class for the webgl-plot library
     */
    class WebGLPlot {
        /**
         * Create a webgl-plot instance
         * @param canvas - the canvas in which the plot appears
         * @param debug - (Optional) log debug messages to console
         *
         * @example
         *
         * For HTMLCanvas
         * ```typescript
         * const canvas = dcoument.getEelementbyId("canvas");
         *
         * const devicePixelRatio = window.devicePixelRatio || 1;
         * canvas.width = canvas.clientWidth * devicePixelRatio;
         * canvas.height = canvas.clientHeight * devicePixelRatio;
         *
         * const webglp = new WebGLplot(canvas);
         * ...
         * ```
         * @example
         *
         * For OffScreenCanvas
         * ```typescript
         * const offscreen = htmlCanvas.transferControlToOffscreen();
         *
         * offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
         * offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;
         *
         * const worker = new Worker("offScreenCanvas.js", { type: "module" });
         * worker.postMessage({ canvas: offscreen }, [offscreen]);
         * ```
         * Then in offScreenCanvas.js
         * ```typescript
         * onmessage = function (evt) {
         * const wglp = new WebGLplot(evt.data.canvas);
         * ...
         * }
         * ```
         */
        constructor(canvas, options) {
            /**
             * log debug output
             */
            this.debug = false;
            if (options == undefined) {
                this.webgl = canvas.getContext("webgl", {
                    antialias: true,
                    transparent: false,
                });
            }
            else {
                this.webgl = canvas.getContext("webgl", {
                    antialias: options.antialias,
                    transparent: options.transparent,
                    desynchronized: options.deSync,
                    powerPerformance: options.powerPerformance,
                    preserveDrawing: options.preserveDrawing,
                });
                this.debug = options.debug == undefined ? false : options.debug;
            }
            this.log("canvas type is: " + canvas.constructor.name);
            this.log(`[webgl-plot]:width=${canvas.width}, height=${canvas.height}`);
            this._lines = [];
            //this.webgl = webgl;
            this.gScaleX = 1;
            this.gScaleY = 1;
            this.gXYratio = 1;
            this.gOffsetX = 0;
            this.gOffsetY = 0;
            // Enable the depth test
            this.webgl.enable(this.webgl.DEPTH_TEST);
            // Clear the color and depth buffer
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT || this.webgl.DEPTH_BUFFER_BIT);
            // Set the view port
            this.webgl.viewport(0, 0, canvas.width, canvas.height);
            this.progThinLine = this.webgl.createProgram();
            this.initThinLineProgram();
        }
        get lines() {
            return this._lines;
        }
        /**
         * updates and redraws the content of the plot
         */
        update() {
            const webgl = this.webgl;
            this.lines.forEach((line) => {
                if (line.visible) {
                    webgl.useProgram(this.progThinLine);
                    const uscale = webgl.getUniformLocation(this.progThinLine, "uscale");
                    webgl.uniformMatrix2fv(uscale, false, new Float32Array([
                        line.scaleX * this.gScaleX,
                        0,
                        0,
                        line.scaleY * this.gScaleY * this.gXYratio,
                    ]));
                    const uoffset = webgl.getUniformLocation(this.progThinLine, "uoffset");
                    webgl.uniform2fv(uoffset, new Float32Array([line.offsetX + this.gOffsetX, line.offsetY + this.gOffsetY]));
                    const uColor = webgl.getUniformLocation(this.progThinLine, "uColor");
                    webgl.uniform4fv(uColor, [line.color.r, line.color.g, line.color.b, line.color.a]);
                    webgl.bufferData(webgl.ARRAY_BUFFER, line.xy, webgl.STREAM_DRAW);
                    webgl.drawArrays(line.loop ? webgl.LINE_LOOP : webgl.LINE_STRIP, 0, line.webglNumPoints);
                }
            });
        }
        clear() {
            // Clear the canvas  //??????????????????
            //this.webgl.clearColor(0.1, 0.1, 0.1, 1.0);
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT || this.webgl.DEPTH_BUFFER_BIT);
        }
        /**
         * adds a line to the plot
         * @param line - this could be any of line, linestep, histogram, or polar
         *
         * @example
         * ```typescript
         * const line = new line(color, numPoints);
         * wglp.addLine(line);
         * ```
         */
        addLine(line) {
            //line.initProgram(this.webgl);
            line._vbuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line._vbuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, line.xy, this.webgl.STREAM_DRAW);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line._vbuffer);
            line._coord = this.webgl.getAttribLocation(this.progThinLine, "coordinates");
            this.webgl.vertexAttribPointer(line._coord, 2, this.webgl.FLOAT, false, 0, 0);
            this.webgl.enableVertexAttribArray(line._coord);
            this.lines.push(line);
        }
        initThinLineProgram() {
            const vertCode = `
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      void main(void) {
         gl_Position = vec4(uscale*coordinates + uoffset, 0.0, 1.0);
      }`;
            // Create a vertex shader object
            const vertShader = this.webgl.createShader(this.webgl.VERTEX_SHADER);
            // Attach vertex shader source code
            this.webgl.shaderSource(vertShader, vertCode);
            // Compile the vertex shader
            this.webgl.compileShader(vertShader);
            // Fragment shader source code
            const fragCode = `
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`;
            const fragShader = this.webgl.createShader(this.webgl.FRAGMENT_SHADER);
            this.webgl.shaderSource(fragShader, fragCode);
            this.webgl.compileShader(fragShader);
            this.progThinLine = this.webgl.createProgram();
            this.webgl.attachShader(this.progThinLine, vertShader);
            this.webgl.attachShader(this.progThinLine, fragShader);
            this.webgl.linkProgram(this.progThinLine);
        }
        /**
         * remove the last line
         */
        popLine() {
            this.lines.pop();
        }
        /**
         * remove all the lines
         */
        removeAllLines() {
            this._lines = [];
        }
        /**
         * Change the WbGL viewport
         * @param a
         * @param b
         * @param c
         * @param d
         */
        viewport(a, b, c, d) {
            this.webgl.viewport(a, b, c, d);
        }
        log(str) {
            if (this.debug) {
                console.log("[webgl-plot]:" + str);
            }
        }
    }

    /**
     * Author Danial Chitnis 2019
     */
    const canvas = document.getElementById("my_canvas");
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const numX = Math.round(canvas.width);
    let numLines = 1;
    let scaleY = 1;
    //let lines: WebglLine[];
    const wglp = new WebGLPlot(canvas);
    let fpsDivder = 1;
    let fpsCounter = 0;
    // new data per frame
    let newDataSize = 1;
    const lineNumList = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    createUI();
    let resizeId;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeId);
        resizeId = window.setTimeout(doneResizing, 500);
    });
    /*let bt = <HTMLButtonElement>document.getElementById("bt");
    bt.addEventListener("click",btclick);*/
    init();
    function newFrame() {
        if (fpsCounter === 0) {
            plot(newDataSize);
            wglp.gScaleY = scaleY;
            wglp.update();
        }
        fpsCounter++;
        if (fpsCounter >= fpsDivder) {
            fpsCounter = 0;
        }
        window.requestAnimationFrame(newFrame);
    }
    window.requestAnimationFrame(newFrame);
    function plot(shiftSize) {
        wglp.lines.forEach((line) => {
            const yArray = randomWalk(line.getY(numX - 1), shiftSize);
            line.shiftAdd(yArray);
        });
    }
    function randomWalk(initial, walkSize) {
        const y = new Float32Array(walkSize);
        y[0] = initial + 0.01 * (Math.round(Math.random()) - 0.5);
        for (let i = 1; i < walkSize; i++) {
            y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
        }
        return y;
    }
    function init() {
        wglp.removeAllLines();
        for (let i = 0; i < numLines; i++) {
            const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
            const line = new WebglLine(color, numX);
            line.lineSpaceX(-1, 2 / numX);
            wglp.addLine(line);
        }
    }
    function doneResizing() {
        //wglp.viewport(0, 0, canv.width, canv.height);
    }
    function createUI() {
        const sliderLines = new SimpleSlider("sliderLine", 0, lineNumList.length - 1, lineNumList.length);
        sliderLines.setValue(0);
        sliderLines.addEventListener("drag-end", () => {
            numLines = lineNumList[Math.round(sliderLines.value)];
            updateTextDisplay();
            init();
        });
        const sliderYSclae = new SimpleSlider("sliderYScale", 0, 2, 0);
        //sliderYSclae.setDebug(true);
        sliderYSclae.setValue(scaleY);
        sliderYSclae.addEventListener("update", () => {
            scaleY = sliderYSclae.value;
            updateTextDisplay();
        });
        const sliderNewData = new SimpleSlider("sliderNewData", 0, 100, 101);
        //sliderYSclae.setDebug(true);
        sliderNewData.setValue(newDataSize);
        sliderNewData.addEventListener("update", () => {
            newDataSize = sliderNewData.value;
            updateTextDisplay();
        });
        const sliderFps = new SimpleSlider("sliderFps", 1, 16, 16);
        //sliderYSclae.setDebug(true);
        sliderFps.setValue(newDataSize);
        sliderFps.addEventListener("update", () => {
            fpsDivder = sliderFps.value;
            updateTextDisplay();
        });
        updateTextDisplay();
    }
    function updateTextDisplay() {
        document.getElementById("numLines").innerHTML = `Line number: ${numLines}`;
        document.getElementById("yScale").innerHTML = `Y scale = ${scaleY.toFixed(2)}`;
        document.getElementById("newData").innerHTML = `New Data Size = ${newDataSize.toFixed(0)}`;
        document.getElementById("fps").innerHTML = `FPS = ${60 / fpsDivder}`;
    }

}());
