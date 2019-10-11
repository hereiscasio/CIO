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
			snackBarColor      : '#F99B2F',
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
								this.snackBarColor = '#3D5AFE'
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
