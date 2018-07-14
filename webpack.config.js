const HtmlWebPackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  module: {
    
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              // localIdentName: '[local]_[hash:base64:8]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    contentBase: './dist'
  },
  // These options allows you to control how webpack notifies you of assets and entrypoints that exceed a specific file limit
  performance: {
    hints: false
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { watch: true }),
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
    }),
    new VueLoaderPlugin(),
    new SWPrecacheWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json'
      },
      {
        from: 'static/*'
      }
    ])
  ],
  // Each module is executed with eval() and a SourceMap is added as a DataUrl to the eval(). Initially it is slow, but it provides fast rebuild speed and yields real files. Line numbers are correctly mapped since it gets mapped to the original code. It yields the best quality SourceMaps for development.
  devtool: process.env.NODE_ENV === 'production' ? '#source-map' : '#eval-source-map'
};