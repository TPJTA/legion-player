const webpack = require('webpack');
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const env = process.env.NODE_ENV
const isDEV = env === 'development'

/** @type {webpack.Configuration} */
let webpackConfig = {
  entry: {
    core: path.join(__dirname, "src/index.ts")
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: `[name]${isDEV ? '' : '.[fullhash:7]'}.js`,
    publicPath: '/',
  },
  devtool: isDEV ? 'eval-source-map' : false,
  resolve: {
    extensions: ['.js', ".ts", '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          "babel-loader",
        ]
      },
      {
        test: /\.ts$/,
        use: [
          "babel-loader",
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'esnext',
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              additionalData: `@import (reference) "@/styles/global.less";`,
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'demo'),
    },
  }
};

module.exports = webpackConfig;