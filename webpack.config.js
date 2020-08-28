/* global __dirname, require, module*/
const config = {
    output: {
        filename: 'TimeLineMap.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {test: /\.(ts|js)x?$/, loader: 'babel-loader'},
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: './src',
        port: 9000,
    },
};

module.exports = config;
