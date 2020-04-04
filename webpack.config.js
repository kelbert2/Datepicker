const webpack = {
    // where to start bundling
    entry: './src/index.tsx',
    // where toe output
    output: {
        filename: 'target/bundle.js',
    },
    devtool: 'source-map',
    // adjust module resolution algorithm
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    // how to resolve encountered inputs
    module: {
        loaders: [{
            test: /.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
        }, {
            test: /.js$/,
            loader: 'source-map-loader',
            enforce: 'pre',
        }]
    }
};

module.exports = webpack;