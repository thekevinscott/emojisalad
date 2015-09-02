
// Add WebPack to use the included CommonsChunkPlugin
var webpack = require('webpack');
var bower_dir = __dirname + '/web/lib/';

var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(new RegExp('^' + name + '$'));
    },

    // We split the entry into two specific chunks. Our web and vendors. Vendors
    // specify that react and reqwest should be part of that chunk
    entry: {
        web: ['./web/main.js'],
        vendors: ['react', 'reqwest', 'react-router']
    },
    resolve: { alias: {} },

    // We add a plugin called CommonsChunkPlugin that will take the vendors chunk
    // and create a vendors.js file. As you can see the first argument matches the key
    // of the entry, "vendors"
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    output: {
        path: './public',
        filename: 'bundle.js'
    },
    module: {
        noParse: [],
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' },
            //{ test: /\.js$/, loader: 'jsx-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|woff)$/, loader: 'url-loader?limit=100000' },
            { test: /\.less$/, loader: "style!css!less" },
        ]
    }
};

config.addVendor('react', bower_dir + 'react/react.js');
config.addVendor('react-router', bower_dir + 'react-router/build/umd/ReactRouter.js');
config.addVendor('reqwest', bower_dir + 'reqwest/reqwest.js');

module.exports = config;
