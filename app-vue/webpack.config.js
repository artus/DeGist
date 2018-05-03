const webpack = require('webpack')
const path = require('path')

const UglifyEsPlugin = require('uglify-es-webpack-plugin')

module.exports = {
    entry: './public/js/requires.js',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'public', 'js'),
        filename: 'bundle.js'
    }, plugins: [
        new UglifyEsPlugin({
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
        })
    ]
}