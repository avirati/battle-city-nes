const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

const getDistDirectory = (env) => env.MODULE === 'SINGLE_PLAYER' ? 'dist/single-player' : 'dist/level-designer';



module.exports = (env) => ({
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: getDistDirectory(env),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
            chunksSortMode: 'none',
        }),
        new TSLintPlugin({
            files: ['./src/**/*.ts']
        }),
        new webpack.DefinePlugin({
            __MODULE__: "'" + env.MODULE + "'",
            __DEV__: env.ENVIRONMENT === 'DEV',
        }),
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src')
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, getDistDirectory(env)),
    },
    devServer: {
        contentBase: path.join(__dirname, getDistDirectory(env)),
        compress: true,
        port: 9000
    }
});
