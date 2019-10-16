module.exports = {
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
