const path = require('path');


  module.exports = [{
  entry: './dist/script.js',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'prod')
  }
},
{
  entry: './dist/sine.js',
  mode: 'development',
  output: {
    filename: 'sine.js',
    path: path.resolve(__dirname, 'prod')
  }
},
{
  entry: './dist/histogram.js',
  mode: 'development',
  output: {
    filename: 'histogram.js',
    path: path.resolve(__dirname, 'prod')
  }
}
];
