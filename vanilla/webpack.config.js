const path = require("path");

module.exports = [
  {
    entry: "./temp/histogram.ts",
    mode: "development",
    output: {
      filename: "histogram.js",
      path: path.resolve(__dirname, "prod"),
    },
  },
];
