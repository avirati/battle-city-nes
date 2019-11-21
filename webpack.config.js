const path = require('path');

const { getPlugins } = require('./plugins');

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
    plugins: getPlugins(env),
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
    },
});
