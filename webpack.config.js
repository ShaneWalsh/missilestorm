var debug = true;//process.env.NODE_ENV !== "production";
const webpack = require('webpack');

module.exports = {
    entry: './src/JavascriptMain.js',
    output: {
        path: './bin',
        filename: 'JavascriptMain.bundle.js',
        publicPath: "./bin/"
    },
	devtool: debug? "inline-sourcemap":null,
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
			query:{
				presets:['es2015']
			}
        },
		{ test: /\.css$/, loader: "style-loader!css-loader" },
		{ test: /\.png$/, loader: "url-loader?limit=100000" },
		/*{test: /.*\.(gif|png|jpe?g|eot|svg|ttf|woff|woff2)$/i,  loaders: [
			'file?hash=sha512&digest=hex&name=[hash].[ext]',
			'image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
		]},*/
		{ test: /\.(eot|svg|ttf|woff|woff2|jpg)$/, loader: "file-loader" }

		]
    },
	plugins: debug ? [] :[
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
               // comments: false,
            },
        }),
    ]
    
}