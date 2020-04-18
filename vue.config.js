const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    transpileDependencies: [
		'vuetify'
	],

    configureWebpack: {
		plugins: [
			new BundleAnalyzerPlugin({
				analyzerMode: 'disabled'
			})
			// new BundleAnalyzerPlugin()
		]
	},

    chainWebpack: config =>
	{
		config.plugins.delete('prefetch');

		/**
		 * Don't allow importing .vue files without the extension, as
		 * it's necessary for some Vetur autocompletions.
		 */
		config.resolve.extensions.delete('.vue');

		// config.optimization.minimize(false);

		if (process.env.NODE_ENV === 'development')
		{
			config.output.filename('[name].[hash].js').end();
		}

		/**
		 *	Only enable performance hints for production builds, outside of tests.
		 */
		config.performance.hints(
			process.env.NODE_ENV === 'production' &&
			!process.env.VUE_APP_TEST &&
			'warning'
		)
	},

    pluginOptions: {
      prerenderSpa: {
        registry: undefined,
        renderRoutes: [
          '/login'
        ],
        useRenderEvent: true,
        headless: true,
		onlyProduction: true
      }
    }
}
