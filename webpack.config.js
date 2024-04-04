const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: path.resolve(__dirname, 'dist') },
        { from: 'contentScripts.js', to: path.resolve(__dirname, 'dist') },
        { from: 'background.js', to: path.resolve(__dirname, 'dist') },
        { from: 'live-score.css', to: path.resolve(__dirname, 'dist') },
        { from: 'icon128.png', to: path.resolve(__dirname, 'dist') }
      ],
    }),
  ],
};
