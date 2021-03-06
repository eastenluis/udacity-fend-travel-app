const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

const { commonPlugins, commonRules } = require('./webpack.common');

module.exports = {
    entry: ['regenerator-runtime/runtime', './src/client/index.js'],
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    module: {
        rules: [
            ...commonRules,
        ],
    },
    plugins: [
        ...commonPlugins,
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false,
        }),
        new EnvironmentPlugin({ NODE_ENV: 'development' }),
    ],
    devServer: {
        proxy: {
            '/api': 'http://localhost:8081',
            '/static': 'http://localhost:8081',
        },
    },
};
