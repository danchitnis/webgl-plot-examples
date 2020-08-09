const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/offScreen.ts",
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: "worker-loader",
      },
      { test: /\.ts?$/, loader: "ts-loader" },
    ],
  },
  //plugins: [new WorkerPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    //need this for the worker-loader
    publicPath: "./dist/",
  },
};
