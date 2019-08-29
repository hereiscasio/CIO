module.exports = {
	/**
	 * TODO: enable a script to run once for setuping somthing
	 */
	//globalSetup: './tests/unit/run-once-before-all-files.js',

	moduleFileExtensions: [
		'js',
		'jsx',
		'json',
		'vue'
	],
	transform: {
		'^.+\\.vue$': 'vue-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
		'^.+\\.jsx?$': 'babel-jest'
	},
	/**
	 * Prevent Jest to watch these guys
	 */
	transformIgnorePatterns: [
		'/node_modules/',
		'/public/',
		'/__mocks__/',
		'/api/',
		'/src/assets/',
		'tests/e2e/'
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	snapshotSerializers: [
		'jest-serializer-vue'
	],
	testMatch: [
		'**/tests/unit/**/*.(test|spec).(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
	],
	testURL: 'http://localhost/',
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname'
	],
	'setupFiles': ['jest-canvas-mock']
}
