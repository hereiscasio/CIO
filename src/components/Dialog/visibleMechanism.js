export default {
	props: ['payload'],

	watch: {
		shouldShowDialog (value)
		{
			if (value) return;
			this.$emit('onHideDialog');
		}
	},

	data() {
		return {
			shouldShowDialog: this.payload
		}
	}
}