const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './popup.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'popup.html', to: path.resolve(__dirname, 'dist') },
        { from: 'manifest.json', to: path.resolve(__dirname, 'dist') },
        { from: 'contentScripts.js', to: path.resolve(__dirname, 'dist') },
        { from: 'background.js', to: path.resolve(__dirname, 'dist') },
      ],
    }),
  ],
};
