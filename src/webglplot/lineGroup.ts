

import {color_rgba} from "./color_rgba";

export class lineGroup {

    public num_points: number;
    public xy: Float32Array;
    public color: color_rgba;
    public intenisty: number;
    public visible: boolean;
    public coord: number;

    public vbuffer: WebGLBuffer;
    public prog: WebGLProgram;


    constructor(c: color_rgba, num: number) {
       this.num_points = num;
       this.color = c;
       this.intenisty = 1;
       this.xy = new Float32Array(2 * this.num_points);
       this.vbuffer = 0;
       this.prog = 0;
       this.coord = 0;
       this.visible = true;
    }

    public setX(index: number, x: number) {
       this.xy[index * 2] = x;
    }

    public setY(index: number, y: number) {
       this.xy[index * 2 + 1] = y;
    }

    public getX(index: number): number {
       return this.xy[index * 2];
    }

    public getY(index: number): number {
       return this.xy[index * 2 + 1];
    }

    public linespaceX() {
       for (let i = 0; i < this.num_points; i++) {
          // set x to -num/2:1:+num/2
          this.setX(i, 2 * i / this.num_points - 1);
        }
    }

    public constY(c: number) {
       for (let i = 0; i < this.num_points; i++) {
          // set x to -num/2:1:+num/2
          this.setY(i, c);
        }
    }

    public shift_add(data: Float32Array) {
       let shift_size = data.length;

       for (let i = 0; i < this.num_points - shift_size; i++) {
          this.setY(i, this.getY(i + shift_size));
       }

       for (let i = 0; i < shift_size; i++) {
          this.setY(i + this.num_points - shift_size, data[i]);
       }

    }


    public present_color(): color_rgba {
       return this.color;
    }
 }
