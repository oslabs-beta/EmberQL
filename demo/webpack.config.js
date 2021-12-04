const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./client/index.tsx",
  //mode: "development",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  devServer: {
    port: 8080,
    publicPath: '/build/',
    //contentBase: './client/src',
    proxy: {
        '/': 'http://localhost:3000',
    },
    hot: true,
    historyApiFallback: true,
  },
  entry: path.resolve(__dirname, './client/index.tsx'),
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            //use: 'ts-loader',
            loader: 'ts-loader',
            // options: {
            //     presets: ['@babel/preset-typescript']
            // }
        },
        {
            test: /.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react', '@babel/preset-env']
            }},
        },
        {
            test: /.(css|scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
            test: /.(png|svg|jpg|gif|woff|ico|woff2|eot|ttf|otf)$/,
            use: ['file-loader'],
        },
    ],
  },
  resolve: {
    extensions: ['.js','.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',

    }),
  ],
};
