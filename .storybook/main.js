const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
	//stories: ['../src/components/**/*.stories.js'],
	stories: ['./stories/**/*.stories.js'],
	addons: [
		//'@storybook/addon-storysource/register',
		'@storybook/addon-actions/register',
		'@storybook/addon-links/register',
		'@storybook/addon-knobs/register',
		'@storybook/addon-notes/register',
		'@storybook/addon-a11y/register',
		'@storybook/addon-viewport/register',
		'./.storybook/addon-show-vue-markup/register'
	],
	webpackFinal: async (config, { configType }) => {
		// `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
		// You can change the configuration based on that.
		// 'PRODUCTION' is used when building the static version of storybook.

		//config.resolve.alias['~storybook'] = path.resolve(__dirname);

		config.module.rules.push({
			resourceQuery: /blockType=story/,
			loader: 'vue-storybook',
		});

		/**
		 * add Sass support
		 */
		config.module.rules.push({
			test: /\.s(a|c)ss$/, // or more specific: `test: /\.scss$/`
			use: ['style-loader', 'css-loader', 'sass-loader'],
			include: path.resolve(__dirname, '../'),
		});

		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.join(__dirname, '..', 'src')
		}

		// Return the altered config
		return config;
	},
};