const webpack = require('webpack');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    getPlugins: (env) => {
        const plugins = [
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
            new CopyPlugin([
                {
                    from: path.resolve(__dirname, 'public/landing.html'),
                    to: path.resolve(__dirname, 'dist/index.html'),
                },
                {
                    from: path.resolve(__dirname, 'public/images'),
                    to: path.resolve(__dirname, 'dist/images'),
                },
            ]),
        ];

        if (env.ENVIRONMENT !== 'DEV') {
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: true,
                        mangle: true,
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: false,
                }),
            )
        }

        return plugins;
    }
}
