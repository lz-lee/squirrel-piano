const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 公共模块
const vendor = [
  'jquery',
  'weui',
  'weui.js',
  'weixin-js-sdk'
]
module.exports = {
  entry: {
    dll: vendor,
  },
  output: {
    path: path.join(__dirname, 'dist'), // 输出路径
    filename: '[name].js',  // 文件名。name 值为entry的key值
    library: '[name]' // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
  },
  // 公共module
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: pathResolve('src'),
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
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
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'image/[hash].[ext]'
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
      }
    ]
  },
  plugins: [

    new webpack.ProvidePlugin({
      $: 'jquery',
      'wx': 'weixin-js-sdk',
      'weui': 'weui.js'
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DllPlugin({
      path: '[name].manifest.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]'  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
    })
  ]
}