// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "./src/randomness.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/randomness.js",
      format: "esm",
    },
  },
  {
    input: "./src/sine.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/sine.js",
      format: "esm",
    },
  },
  {
    input: "./src/microphone.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/microphone.js",
      format: "esm",
    },
  },
  {
    input: "./src/camera_hist.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/camera_hist.js",
      format: "esm",
    },
  },
  {
    input: "./src/static.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/static.js",
      format: "esm",
    },
  },
  {
    input: "./src/polar.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/polar.js",
      format: "esm",
    },
  },
  {
    input: "./src/radar.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/radar.js",
      format: "esm",
    },
  },
  {
    input: "./src/grid.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/grid.js",
      format: "esm",
    },
  },
  {
    input: "./src/cross.ts",
    plugins: [typescript(), resolve()],
    output: {
      file: "./dist/cross.js",
      format: "esm",
    },
  },
];
