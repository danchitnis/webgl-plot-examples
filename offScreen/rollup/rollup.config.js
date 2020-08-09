// rollup.config.js
import sourceMaps from "rollup-plugin-sourcemaps";
import workerLoader from "rollup-plugin-web-worker-loader";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/offScreen.ts",
  output: {
    dir: "./prod",
    format: "iife",
  },
  plugins: [resolve(), commonjs(), workerLoader(), typescript(), sourceMaps()],
};
