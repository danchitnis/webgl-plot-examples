const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  mode: "development",
  entry: "./src/offScreen.ts",
  plugins: [
    new WorkerPlugin({
      // use "self" as the global object when receiving hot updates.
      globalObject: "self", // <-- this is the default value
    }),
  ],
  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
  },

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
