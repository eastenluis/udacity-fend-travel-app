const { GenerateSW } = require('workbox-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const { commonPlugins, commonRules } = require('./webpack.common');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    module: {
        rules: [
            ...commonRules,
        ],
    },
    plugins: [
        ...commonPlugins,
        new EnvironmentPlugin({ NODE_ENV: 'production' }),
        new GenerateSW(),
    ],
};
