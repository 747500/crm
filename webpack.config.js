
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/i,
				use: [
					'vue-style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: 'public',
						},
					},
					'css-loader'
				],
			}
			/*{
				test: /\.css$/,
				//loader: 'style!css',
				use: [
					'vue-style-loader',
					'style-loader',
					'css-loader'
				]
			},*/
			/*{
				test: /\.css$/,
				use: [
					process.env.NODE_ENV !== 'production'
							? 'vue-style-loader'
							: MiniCssExtractPlugin.loader,
							'css-loader'
				]
			}*/
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'bundle.css'
		}),
		new HtmlWebpackPlugin({
			template: 'app/index.html',
		})
	],
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	}
}
