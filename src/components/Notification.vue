<template>
<v-snackbar
	:value='shouldShowSnackBar' :color='snackBarColor' dark :timeout='snackBarTimeout'
>
		{{content}}
		<v-btn
			@click="onTurnOffNotification()" text icon
		>
			<v-icon v-text='`close`'/>
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
.v-snack {
	right: 8px;
	left: 8px;
}
@media (min-width: 599px) { // if >= 600, then ...
	.v-snack {
		top: 8px;
		right: 36px;
		bottom: auto;
		left: auto; // TODO: remove this, because it's bug from Vuetify
		max-width: 320px;
	}
}
</style>
