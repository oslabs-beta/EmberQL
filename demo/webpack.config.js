const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './client/index.tsx',
  devtool: 'source-map',
  //mode: "development",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    //publicPath: '/',
  },
  devServer: {
    port: 8080,
    // publicPath: '/build/',
    host: 'localhost',
    contentBase: path.resolve(__dirname, '/compiledTS/client'),

    proxy: {
      '/**': 'http://localhost:3000/',
    },
    hot: true,
    historyApiFallback: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  //entry: path.resolve(__dirname, './client/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },

      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        //exclude: /node_modules/,
        include: path.resolve(__dirname, 'client'),
        use: ['style-loader', 'css-loader'],
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
      filename: 'index.html',
      title: 'EmberQL',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: 'styles.css',
    }),
  ],
};
