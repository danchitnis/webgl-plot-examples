/**
 * Author Danial Chitnis 2019
 *
 * inspired by:
 * https://codepen.io/AzazelN28
 * https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
 */

import {lineGroup} from "./lineGroup";


export class webGLplot {

   public gl: WebGLRenderingContext;

   public scaleX: number;
   public scaleY: number;

   public linegroups: lineGroup[];



    /**
     *
     * @param canv
     * @param array
     */
    constructor(canv: HTMLCanvasElement) {

      const devicePixelRatio = window.devicePixelRatio || 1;

      // set the size of the drawingBuffer based on the size it's displayed.
      canv.width = canv.clientWidth * devicePixelRatio;
      canv.height = canv.clientHeight * devicePixelRatio;

      const gl =  canv.getContext("webgl", {
         antialias: true,
         transparent: false,
      }) as WebGLRenderingContext;

      this.linegroups = [];

      this.gl = gl;

      this.scaleX = 1;
      this.scaleY = 1;



      // Clear the canvas  //??????????????????
      // gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clearColor(0.1, 0.1, 0.1, 1.0);

      // Enable the depth test
      gl.enable(gl.DEPTH_TEST);

      // Clear the color and depth buffer
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Set the view port
      gl.viewport(0, 0, canv.width, canv.height);

    }

   /**
   * update
   */

   public update() {
      const gl = this.gl;

      this.linegroups.forEach((lg) => {
         if (lg.visible) {
            gl.useProgram(lg.prog);

            const uscale = gl.getUniformLocation(lg.prog, "uscale");
            gl.uniformMatrix2fv(uscale, false, new Float32Array([this.scaleX, 0, 0, this.scaleY]));

            const uColor = gl.getUniformLocation(lg.prog,"uColor");
            gl.uniform4fv(uColor, [lg.present_color().r, lg.present_color().g, lg.present_color().b, lg.present_color().a]);

            gl.bufferData(gl.ARRAY_BUFFER,  lg.xy as ArrayBuffer, gl.STREAM_DRAW);

            gl.drawArrays(gl.LINE_STRIP, 0, lg.num_points);
         }

      });

   }

   public clear() {
      // Clear the canvas  //??????????????????
      this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
   }

   public add_line(line: lineGroup) {

      line.vbuffer = ( this.gl.createBuffer() as WebGLBuffer);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.vbuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER,  line.xy as ArrayBuffer, this.gl.STREAM_DRAW);

      const vertCode = `
      attribute vec2 coordinates;
      uniform mat2 uscale;
      void main(void) {
         gl_Position = vec4(uscale*coordinates, 0.0, 1.0);
      }`;

      // Create a vertex shader object
      const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);

      // Attach vertex shader source code
      this.gl.shaderSource( vertShader as WebGLShader, vertCode);

      // Compile the vertex shader
      this.gl.compileShader( vertShader as WebGLShader);

      // Fragment shader source code
      const fragCode = `
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`;


      const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource( fragShader as WebGLShader, fragCode);
      this.gl.compileShader( fragShader as WebGLShader);
      line.prog = ( this.gl.createProgram() as WebGLProgram);
      this.gl.attachShader(line.prog,  vertShader as WebGLShader);
      this.gl.attachShader(line.prog,  fragShader as WebGLShader);
      this.gl.linkProgram(line.prog);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.vbuffer);

      line.coord = this.gl.getAttribLocation(line.prog, "coordinates");
      this.gl.vertexAttribPointer(line.coord, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(line.coord);

      this.linegroups.push(line);
   }

   public viewport(a: number, b: number, c: number, d: number) {
      this.gl.viewport(a, b, c, d);
   }

   private combine_xy(x: Float32Array, y: Float32Array): Float32Array {
      const xy = new Float32Array(2 * y.length);
      let j = 0;
      for (let i = 0; i < y.length; i++) {
         xy[j] = x[i];
         xy[j + 1] = y[i];
         j = j + 2;
      }
      return xy;
   }



 }
