
const path = require('path');


module.exports = {
  mode: 'development',
  entry: {
    app: './test/index.js',
  },
  output: {
    path: path.resolve(__dirname, '..', 'tmp'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)\/(?!pretty-bytes\/).*/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' ,
    },
  },
  performance: {
    hints: false,
  },
};
