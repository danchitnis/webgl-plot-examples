(function () {
    'use strict';

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

    const numLines = 2;
    const canvas = document.getElementById("my_canvas");
    let numX;
    let display;
    let wglp;
    //let lines: WebglLine[];
    let Rect;
    let scale = 1;
    let offset = 0;
    let pinchZoom = false;
    let drag = false;
    let zoom = false;
    let dragInitialX = 0;
    let dragOffsetOld = 0;
    let initialX = 0;
    const devicePixelRatio = window.devicePixelRatio || 1;
    createUI();
    init();
    let resizeId;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeId);
        resizeId = window.setTimeout(doneResizing, 500);
    });
    function newFrame() {
        update();
        //wglp.clear();
        wglp.update();
        window.requestAnimationFrame(newFrame);
    }
    window.requestAnimationFrame(newFrame);
    function init() {
        //const devicePixelRatio = 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        //numX = Math.round(canv.clientWidth * devicePixelRatio);
        numX = 100000;
        wglp = new WebGLPlot(canvas);
        wglp.removeAllLines();
        for (let i = 0; i < numLines; i++) {
            const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
            const line = new WebglLine(color, numX);
            line.lineSpaceX(-1, 2 / numX);
            wglp.addLine(line);
        }
        wglp.lines.forEach((line) => {
            line.setY(0, Math.random() - 0.5);
            for (let i = 1; i < line.numPoints; i++) {
                let y = line.getY(i - 1) + 0.01 * (Math.round(Math.random()) - 0.5);
                if (y > 0.9) {
                    y = 0.9;
                }
                if (y < -0.9) {
                    y = -0.9;
                }
                line.setY(i, y);
            }
        });
        // add zoom rectangle
        Rect = new WebglLine(new ColorRGBA(0.9, 0.9, 0.9, 1), 4);
        Rect.loop = true;
        Rect.xy = new Float32Array([-0.5, -1, -0.5, 1, 0.5, 1, 0.5, -1]);
        Rect.visible = false;
        wglp.addLine(Rect);
        // test rec
        const testRect = new WebglLine(new ColorRGBA(0.1, 0.9, 0.9, 1), 4);
        testRect.loop = true;
        testRect.xy = new Float32Array([-0.7, -0.8, -0.7, 0.8, -0.6, 0.8, -0.6, -0.8]);
        wglp.addLine(testRect);
        //wglp.viewport(0, 0, 1000, 1000);
        wglp.gScaleX = 1;
        canvas.addEventListener("wheel", zoomEvent);
        canvas.addEventListener("touchstart", touchStart);
        canvas.addEventListener("touchmove", touchMove);
        canvas.addEventListener("touchend", touchEnd);
        canvas.addEventListener("mousedown", mouseDown);
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("dblclick", dblClick);
        canvas.addEventListener("contextmenu", contextMenu);
        canvas.style.cursor = "zoom-in";
        //window.addEventListener("keydown", keyEvent);
    }
    function update() {
        if (wglp) {
            display.innerHTML =
                "Zoom: " + wglp.gScaleX.toFixed(2) + ", Offset: " + wglp.gOffsetX.toFixed(2);
        }
    }
    function dblClick(e) {
        e.preventDefault();
        wglp.gScaleX = 1;
        wglp.gOffsetX = 0;
    }
    function contextMenu(e) {
        e.preventDefault();
    }
    let cursorDownX = 0;
    function mouseDown(e) {
        e.preventDefault();
        console.log(e.clientX);
        if (e.button == 0) {
            zoom = true;
            canvas.style.cursor = "pointer";
            cursorDownX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
            //cursorDownX = (cursorDownX - wglp.gOffsetX) / wglp.gScaleX;
            Rect.visible = true;
        }
        if (e.button == 2) {
            drag = true;
            canvas.style.cursor = "grabbing";
            dragInitialX = e.clientX * devicePixelRatio;
            dragOffsetOld = wglp.gOffsetX;
        }
    }
    function mouseMove(e) {
        e.preventDefault();
        if (zoom) {
            const cursorOffsetX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
            Rect.xy = new Float32Array([
                (cursorDownX - wglp.gOffsetX) / wglp.gScaleX,
                -1,
                (cursorDownX - wglp.gOffsetX) / wglp.gScaleX,
                1,
                (cursorOffsetX - wglp.gOffsetX) / wglp.gScaleX,
                1,
                (cursorOffsetX - wglp.gOffsetX) / wglp.gScaleX,
                -1,
            ]);
            Rect.visible = true;
        }
        if (drag) {
            const moveX = e.clientX * devicePixelRatio - dragInitialX;
            const offsetX = (wglp.gScaleY * moveX) / 1000;
            wglp.gOffsetX = offsetX + dragOffsetOld;
        }
    }
    function mouseUp(e) {
        e.preventDefault();
        if (zoom) {
            const cursorUpX = (2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
            const zoomFactor = Math.abs(cursorUpX - cursorDownX) / (2 * wglp.gScaleX);
            const offsetFactor = (cursorDownX + cursorUpX - 2 * wglp.gOffsetX) / (2 * wglp.gScaleX);
            if (zoomFactor > 0) {
                wglp.gScaleX = 1 / zoomFactor;
                wglp.gOffsetX = -offsetFactor / zoomFactor;
            }
        }
        zoom = false;
        drag = false;
        canvas.style.cursor = "zoom-in";
        //Rect.visible = false;
    }
    function zoomEvent(e) {
        e.preventDefault();
        const cursorOffsetX = (-2 * (e.clientX * devicePixelRatio - canvas.width / 2)) / canvas.width;
        if (e.shiftKey) {
            offset += e.deltaY * 0.1;
            wglp.gOffsetX = 0.1 * offset;
        }
        else {
            scale += e.deltaY * -0.01;
            scale = Math.min(100, scale);
            scale = Math.max(1, scale);
            const gScaleXOld = wglp.gScaleX;
            wglp.gScaleX = 1 * Math.pow(scale, 1.5);
            if (scale > 1 && scale < 100) {
                wglp.gOffsetX = ((wglp.gOffsetX + cursorOffsetX) * wglp.gScaleX) / gScaleXOld;
            }
            if (scale <= 1) {
                wglp.gOffsetX = 0;
            }
        }
    }
    /*
     * Pinch and Zoom
     **/
    function touchStart(e) {
        //
        e.preventDefault();
        log("touched");
        if (e.touches.length == 2) {
            pinchZoom = true;
            drag = false;
            initialX = e.touches[0].pageX - e.touches[1].pageX;
            log("pinch started");
        }
        if (e.touches.length == 1) {
            drag = true;
            pinchZoom = false;
            initialX = e.touches[0].pageX;
        }
    }
    function touchMove(e) {
        e.preventDefault();
        if (pinchZoom) {
            const newX = e.touches[0].pageX - e.touches[1].pageX;
            const deltaX = (initialX - newX) / 10;
            scale = scale + deltaX;
            scale = Math.min(100, scale);
            scale = Math.max(1, scale);
            wglp.gScaleX = 1 * Math.pow(scale, 1.5);
            //log(diffX.toFixed(2));
            initialX = newX;
        }
        if (drag) {
            const newX = e.touches[0].pageX;
            const deltaX = initialX - newX;
            offset = offset - deltaX;
            offset = Math.min(1000, offset);
            offset = Math.max(-1000, offset);
            wglp.gOffsetX = offset / 100;
            initialX = newX;
        }
    }
    function touchEnd(e) {
        //
        e.preventDefault();
        pinchZoom = false;
        drag = false;
    }
    function doneResizing() {
        //wglp.viewport(0, 0, canv.width, canv.height);
    }
    function createUI() {
        const ui = document.getElementById("ui");
        display = document.createElement("p");
        display.innerHTML = "hello😉";
        ui.appendChild(display);
    }
    function log(str) {
        display.innerHTML = str;
    }

}());
