<template>
<v-app>
	<router-view/>

	<!-- <Notification
		v-if='shouldShow.notification'
		:mode='notificationMode'
		:otpCode='otpCode'
	/> -->
</v-app>
		<!-- <v-snackbar
		v-show='!shouldShow.appHomePage' :value='true' color='#FF5252' dark
		data-cy="snack-bar--otp-checker"
		>
		Expired or wrong code
		<v-btn color="white" text v-text='`Resend`'/>
		</v-snackbar> -->
</template>

<script>
export default {
	beforeCreate() {
		/*
		 * temporarily comment out
		 * this.$router.push({ path: 'landing' })
		 */
		localStorage.setItem('userId', '0966001596')
		/**
		 * Go view: sign-up if haven't registered, otherwise redirect to view: logged
		 */
		if (localStorage.userId === undefined) {
			this.$router.replace({ path: 'signup' })
		}
	},
	data () {
		return {

		}
	},
	methods: {
		/*
		 * makeRequestToReceiveOTP (byThisMobileNumber) {
		 * 	const thisNumberHasBeenSentJustBefore = includes(this.sentMobileNumbers, byThisMobileNumber)
		 */

		// 	if (thisNumberHasBeenSentJustBefore) return

		/*
		 * 	axios.get('/otp?mobile_number=' + byThisMobileNumber).then(response => {
		 * 		this.sentMobileNumbers.push(byThisMobileNumber)
		 * 		this.shouldShow.notification = true
		 * 		this.notificationMode = 'otpProvider'
		 * 		this.otpCode = response.data[0]
		 * 	})
		 * }
		 */
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
* {
	font-family: 'Space Mono', monospace;
}
.v-application--wrap {
	background: white;
}
</style>
