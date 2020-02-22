<template>
<v-snackbar
	:value='shouldShowSnackBar' :color='snackBarColor' dark :timeout='snackBarTimeout'
	v-bind='position'
>
		{{content}}
		<v-btn
			@click="onTurnOffNotification()" text
		>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#close"></use>
			</svg>
		</v-btn>
</v-snackbar>
</template>

<script>
import TYPE from 'vue-types'
export default {
	props: {
		mode    : TYPE.string.def(''),
		otpCode : TYPE.string.def('')
	},
	data () {
		return {
			shouldShowSnackBar : false,
			snackBarTimeout    : 0,
			snackBarColor      : '#3D5AFE',
			content			   : ''
		}
	},
	methods: {
		onTurnOffNotification()
		{
			this.shouldShowSnackBar = false

			if (this.mode === 'tip')
			{
				this.$vlf.setItem('doNotShowTipAnyMore', true)
			}
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
	},
	watch: {
		mode: {
			handler: function (value) {
				switch (value) {
					case 'tip':
						this.$vlf.getItem('doNotShowTipAnyMore').then(v =>
						{
							if (!v) {
								this.content = 'Click any date above to see the clock-in-out time at that day'
								this.shouldShowSnackBar = true
								this.snackBarTimeout = 3000
							}
						})
						break

					case '': this.shouldShowSnackBar = false; break
				}
			},
			immediate: true

		}
	}
}
</script>
<style lang='scss' scoped>
// TODO: try to remove this in future, because it's bug from Vuetify
@media (min-width: 600px) {
	::v-deep .v-snack__wrapper {
		min-width: 320px !important;
		max-width: 320px !important;
	}
}
</style>
