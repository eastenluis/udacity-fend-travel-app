const HtmlWebPackPlugin = require('html-webpack-plugin');

const commonRules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
    },
];

const commonPlugins = [
    new HtmlWebPackPlugin({
        template: './src/client/views/index.html',
        filename: './index.html',
    }),
];

module.exports = {
    commonPlugins,
    commonRules,
};
