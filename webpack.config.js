const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJsPluginConfig = new UglifyJsPlugin({
    uglifyOptions: {
        mangle: {
            reserved: [
                'Buffer',
                'BigInteger',
                'Point',
                'ECPubKey',
                'ECKey',
                'sha512_asm',
                'asm',
                'ECPair',
                'HDNode'
            ]
        }
    }
});

module.exports = {
    entry: './js/requires.js',
    target: 'web',
    output: {
        filename: './js/bundle.js',
    }, plugins: [
        UglifyJsPluginConfig
    ]
}