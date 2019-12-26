
/*export default {
  input: './dist/randomness.js',
  output: {
    file: './prod/randomness.js',
    format: 'iife'
  }
};*/
/*export const sine = {
  input: './dist/sine.js',
  output: {
    file: './prod/sine.js',
    format: "iife"
  }
}*/
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './src/randomness.ts',
  output: {
    dir: './prod',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({lib: ["es6"], target: "es6"})
  ]
};