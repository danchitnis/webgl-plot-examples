const path = require("path");

module.exports = [
  {
    entry: "./dist/randomness.js",
    mode: "development",
    output: {
      filename: "randomness.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/sine.js",
    mode: "development",
    output: {
      filename: "sine.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/polar.js",
    mode: "development",
    output: {
      filename: "polar.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/radar.js",
    mode: "development",
    output: {
      filename: "radar.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/histogram.js",
    mode: "development",
    output: {
      filename: "histogram.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/camera_hist.js",
    mode: "development",
    output: {
      filename: "camera_hist.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/microphone.js",
    mode: "development",
    output: {
      filename: "microphone.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
  {
    entry: "./dist/static.js",
    mode: "development",
    output: {
      filename: "static.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
];
