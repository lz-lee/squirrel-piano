const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let entries = getEntry('src/js/*.js')
let chunks = Object.keys(entries)
 
let config = {
    entry: entries,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '../',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js?[chunkhash]'
    },
    module: {
        loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
                },{
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('css-loader!less-loader')
                },{
                    test: /\.html$/,
                    loader: 'html-loader?attrs=img:src img:data-src'
                },{
                    test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=./fonts/[name].[ext]'
                },{
                    test: /\.(png|jpg|gif)$/,
                    loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
                },{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
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
