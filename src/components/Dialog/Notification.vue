<template>
<v-snackbar
	:value='shouldShowDialog' color='#3D5AFE' dark persistent :timeout="0"
	v-bind='position'
>
		Click any date above to see the clock-in-out time at that day
		<v-btn
			@click="onTurnOffNotification()" text fab
		>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#close"></use>
			</svg>
		</v-btn>
</v-snackbar>
</template>

<script>
export default {
	extends: require('./visibleMechanism.js').default,

	methods: {
		onTurnOffNotification()
		{
			this.shouldShowDialog = false;
			localStorage.setItem('showTips', false);
		}
	},

	computed: {
		position() {
			let smAndUp = this.$vuetify.breakpoint.smAndUp
			return {
				right: smAndUp,
				top: smAndUp
			}
		}
	}
}
</script>

<style lang='scss' scoped>

// TODO:
// try to remove this in future,
// because it's bug from Vuetify
@media (min-width: 600px) {
	::v-deep .v-snack__wrapper {
		min-width: 320px !important;
		max-width: 320px !important;
	}
}
</style>
