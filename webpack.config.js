const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pathResolve = (dir) => {
  return path.join(__dirname, dir)
}

let entries = getEntry('src/js/*.js')
let chunks = Object.keys(entries)
 
let config = {
  devtool: 'eval-source-map',
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].chunk.js?[chunkhash]'
  },
  resolve: {
    alias: {
      'src': pathResolve('src'),
      'common': pathResolve('src/common'),
      'libs': pathResolve('src/libs')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: pathResolve('src'),
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
      },{
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-import')(),
                    require('postcss-flexbugs-fixes'),
                    require('autoprefixer')({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9',
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                }
              },
              {
                loader: 'less-loader'
              }
            ]
          })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src', 'img:src']
          }
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: './fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'img/[hash].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      'wx': 'weixin-js-sdk',
      'weui': 'weui.js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: 1
    }),
    new ExtractTextPlugin('css/[name].css'),
    // new HtmlWebpackPlugin({
    //     favicon: './src/img/favicon.ico',
    //     filename: './view/index.html',
    //     template: './src/view/index.html',
    //     indect: 'body',
    //     hash: true,
    //     chunks: ['vendors', 'index'],
    //     minify: {
    //         removeComments: true,
    //         collapseWhitespace: false
    //     }
    // }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist/view/',
    host: '0.0.0.0',
    port: 4500,
    inline: true,
    hot: true
  }
}
let pages = Object.keys(getEntry('src/view/*.html'))

pages.forEach((pathname) => {
    let conf = {
        filename: 'view/' + pathname + '.html',
        template: 'src/view/' + pathname + '.html',
        inject: false
    }
    if(pathname in config.entry){
        conf.favicon = 'src/img/favicon.ico'
        conf.inject = 'body'
        conf.chunks = ['vendors', pathname]
        conf.hash = true
    }
    config.plugins.push(new HtmlWebpackPlugin(conf))
})

module.exports = config

function getEntry(globPath) {
    let files = glob.sync(globPath)
    let entries = {}, entry, basename, extname

    for(let i = 0; i < files.length; i++){
        entry = files[i]
        extname = path.extname(entry)
        basename = path.basename(entry, extname)
        entries[basename] = ['./' + entry]
    }
    return entries
}
