const path = require('path');

module.exports = [{
  entry: './src/script.js',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
},
{
  entry: './src/lines.js',
  mode: 'development',
  output: {
    filename: 'lines.js',
    path: path.resolve(__dirname, 'dist')
  }
}];
