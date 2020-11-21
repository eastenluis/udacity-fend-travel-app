const { parse } = require('dotenv/types');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const parsedEnv = require('dotenv').config();

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
    new webpack.DefinePlugin({
        'process.env.GEONAMES_USERNAME': parsedEnv.GEONAMES_USERNAME,
        'process.env.WEATHERBIT_API_KEY': parsedEnv.WEATHERBIT_API_KEY,
        'process.env.PIXABAY_API_KEY': parsedEnv.PIXABAY_API_KEY,
    }),
    new HtmlWebPackPlugin({
        template: './src/client/views/index.html',
        filename: './index.html',
    }),
];

module.exports = {
    commonPlugins,
    commonRules,
};
