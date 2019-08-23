module.exports = {
	lintOnSave: false,
	devServer: {
		proxy: {
			'/otp': {
				target: 'http://localhost:3001/',
				changeOrigin: true,
				secure: false,
				/**
				 * rewrite 'localhost:8080/otp?mobile_number=0966001596'
				 * to      'localhost:3001/otp'
				 * where "otp" of "localhost:3001/otp" is property name of db.json
				 */
				pathRewrite: {
					'/otp*': '/otp'
				}
			}
		}
	}
}
