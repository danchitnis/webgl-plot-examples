// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/randomness.ts",
  plugins: [typescript(), resolve()],
  output: {
    file: "./dist/randomness.js",
    format: "iife",
  },
};
