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
    ],
};
