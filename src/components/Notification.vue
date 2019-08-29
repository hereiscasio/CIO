<template>
<v-snackbar
	:value='shouldShowSnackBar' :color='snackBarColor' dark :timeout='snackBarTimeout'
>
		<!-- DEPRECATED -->
		<!-- <v-layout
				v-if='mode === "otpProvider"'
				data-cy="snack-bar--otp-provider" nowrap
		>
				<v-flex>Your verification code is</v-flex>
				<v-flex class='font-weight-black'>{{otpCode}}</v-flex>
		</v-layout> -->
		<!-- <template v-else-if='mode === "greeting" || mode === "usageTips"'>
				{{content}}
				<v-btn
					@click="shouldShowSnackBar = false" text icon
				>
					<v-icon v-text='`close`'/>
				</v-btn>
		</template> -->
		{{content}}
		<v-btn
			@click="shouldShowSnackBar = false; $emit('on-click-closing-button')" text icon
		>
			<v-icon v-text='`close`'/>
		</v-btn>
</v-snackbar>
</template>

<script>
import TYPE from 'vue-types'
export default {
	props: {
		content : String,
		mode    : TYPE.string.def(''),
		otpCode : TYPE.string.def('')
	},
	data () {
		return {
			shouldShowSnackBar : false,
			snackBarTimeout    : 0,
			snackBarColor      : '#F99B2F'
		}
	},
	watch: {
		mode: {
			handler: function (val) {
				switch (val) {
					case 'greeting':
						localStorage.setItem('firstTimeUse', false)
						this.shouldShowSnackBar = true
						break

					case 'usageTips':
						this.shouldShowSnackBar = true
						this.snackBarTimeout = 3000
						this.snackBarColor = '#3D5AFE'
						break

					case '': this.shouldShowSnackBar = false; break
				}
			},
			immediate: true

		}
	}
}
</script>
