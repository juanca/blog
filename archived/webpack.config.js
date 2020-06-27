module.exports = {
  entry: {
    app: './src/index.jsx',
  },

  module: {
    loaders: [{
      loader: 'babel-loader',
      query: {
        presets: [
          'babel-preset-es2015'
        ],
      },
      test: /\.js$/,
    }, {
      loader: 'babel-loader',
      query: {
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
        ],
      },
      test: /\.jsx$/,
    }],
  },

  output: {
    filename: 'bundle.js',
  },
};
