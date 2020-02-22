// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	/**
	 * Not sure if this setting still necessary due to current
	 * Vuetify version 2.x
	 * see more : https://tinyurl.com/yycsp56o
	 */
	transpileDependencies:[/node_modules[/\\\\]vuetify[/\\\\]/],
	// css: {
	// 	/**
	// 	 * related issue / sol
	// 	 * https://joshuatz.com/posts/2019/vue-mixing-sass-with-scss-with-vuetify-as-an-example/
	// 	 * https://github.com/vuetifyjs/vuetify/issues/6767
	// 	 * https://github.com/vuetifyjs/vuetify/issues/6816
	// 	 * https://stackoverflow.com/questions/57333274/how-to-change-breakpoints-in-the-scss-in-vuetify-v2
	// 	 *
	// 	 * issue still existed
	// 	 */
	// 	loaderOptions: {
	// 		scss: {
	// 			data: `@import "@/sass/variables.scss";`
	// 		}
	// 	}
	// },
	/**
	 * if use, bug appear
	 */
	/*
	 * configureWebpack: {
	 * 	optimization: {
	 * 		minimizer: [
	 * 			new UglifyJsPlugin({
	 * 				uglifyOptions: {
	 * 					compress: {
	 * 						drop_console: true, //console
	 * 						drop_debugger: true,
	 * 						pure_funcs: ['console.log', 'console.warn', 'alert']// remove console
	 * 					}
	 * 				}
	 * 			})
	 * 		]
	 * 	}
	 * },
	 */

	lintOnSave: false,

	devServer: {
		/**
		 * All unknowns request will proxy to below domain: mock server
		 * which is a faker to handle api request
		 */
		// proxy:'http://localhost:3000'
		// proxy: {
		// 	'/otp': {
		// 		target: 'http://localhost:3001/',
		// 		changeOrigin: true,
		// 		secure: false,
		// 		/**
		// 		 * rewrite 'localhost:8080/otp?mobile_number=0966001596'
		// 		 * to      'localhost:3001/otp'
		// 		 * where "otp" of "localhost:3001/otp" is property name of db.json
		// 		 */
		// 		pathRewrite: {
		// 			'/otp*': '/otp'
		// 		}
		// 	}
		// }
	}
}
