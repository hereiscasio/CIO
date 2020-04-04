export default {
	methods: {
		getSvgPath(svgId) {
			return require('@/assets/sprite.svg') + '#' + svgId;
		}
	}
}