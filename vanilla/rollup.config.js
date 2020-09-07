// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "./src/randomness.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/randomness.js",
      format: "iife",
    },
  },
  {
    input: "./src/sine.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/sine.js",
      format: "iife",
    },
  },
  {
    input: "./src/microphone.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/microphone.js",
      format: "iife",
    },
  },
  {
    input: "./src/camera_hist.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/camera_hist.js",
      format: "iife",
    },
  },
  {
    input: "./src/static.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/static.js",
      format: "iife",
    },
  },
];
