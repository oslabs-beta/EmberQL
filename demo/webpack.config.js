const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./client/index.tsx",
  //mode: "development",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    port: 8080,
    publicPath: '/',
    //contentBase: './client/src',

    proxy: {
      '/': 'http://localhost:3000',
    },
    hot: true,
    historyApiFallback: true,
  },
  //entry: path.resolve(__dirname, './client/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env', "@babel/preset-typescript"]
          }
        },
      },
      {
        test: /\.css$/i,
        //exclude: /node_modules/,
        include: path.resolve(__dirname, "client"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.(png|svg|jpg|gif|woff|ico|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // new MiniCssExtractPlugin({
    //    filename: "styles.css",
    //   // chunkFilename: "styles.css",
    //   //filename: "[name].[contenthash].css",
    // }),
  ],
};
