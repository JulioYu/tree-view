const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssImport = require('postcss-import');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        './demo/index.tsx',
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'static/bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['ts-loader'],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => (
                                    [
                                        postcssImport({
                                            root: loader.resourcePath,
                                        }),
                                    ]
                                ),
                            },
                        },
                    ],
                    fallback: 'style-loader',
                    publicPath: '.',
                }),
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg|cur)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: './resources/media/index/[name].[ext]',
                    },
                },
            },
        ],
    },
    devServer: {
        inline: true,
        port: 3001,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `${__dirname}/demo/index.html`,
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                decodeEntities: true,
                minifyCSS: false,
                minifyJS: false,
                removeComments: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
            },
        }),
        new ExtractTextPlugin('static/styles.css'),
    ],
};
