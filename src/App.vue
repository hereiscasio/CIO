<template>
<v-app>
	<!-- <Notification
		v-if='shouldShow.notification'
		:mode='notificationMode'
		:otpCode='otpCode'
	/>
	<template v-if='!shouldShow.dashboard'>
		<AppHomePage
			v-show='shouldShow.appHomePage' :makeRequestToReceiveOTP='makeRequestToReceiveOTP'
		/>
		<OtpVerification
			v-if='shouldShowOtpVerification' @showThisPage='showThisPage'
		/> -->
		<!--

		<v-snackbar
		v-show='!shouldShow.appHomePage' :value='true' color='#FF5252' dark
		data-cy="snack-bar--otp-checker"
		>
		Expired or wrong code
		<v-btn color="white" text v-text='`Resend`'/>
		</v-snackbar> -->
    <!-- <ClockInOut name='Jack'></ClockInOut>
	</template>
	<HistoryDashboard v-else/> -->
	<HistoryDashboard/>
</v-app>
</template>

<script>

import HistoryDashboard from './components/HistoryDashboard'
import ClockInOut from './components/ClockInOut'
import AppHomePage from './components/Registration/AppHomePage'
import OtpVerification from './components/Registration/OtpVerification'
import Notification from './components/Notification'
import axios from 'axios'
import { includes } from 'lodash-core'
export default {
	data () {
		return {
			notificationMode: 'otpProvider',
			shouldShow: {
				appHomePage: true,
				historyDashboard: false,
				notification: false
			},
			otpCode: undefined,
			sentMobileNumbers: []
		}
	},
	computed: {
		shouldShowOtpVerification () {
			if (
				this.shouldShow.appHomePage === false &&
				this.shouldShow.historyDashboard === false
			) {
				return true
			}
			return false
		}
	},
	watch: {
		shouldShowOtpVerification (value) {
			if (value === false) {
				this.shouldShow.notification = false
			}
		}
	},
	methods: {
		showThisPage (pageName) {
			switch (pageName) {
				case 'HistoryDashboard' : this.shouldShow.historyDashboard = true; break
				case 'AppHomePage': this.shouldShow.appHomePage = true; break
			}
		},
		makeRequestToReceiveOTP (byThisMobileNumber) {
			const thisNumberHasBeenSentJustBefore = includes(this.sentMobileNumbers, byThisMobileNumber)

			this.shouldShow.appHomePage = false

			if (thisNumberHasBeenSentJustBefore) return

			axios.get('/otp?mobile_number=' + byThisMobileNumber).then(response => {
				this.sentMobileNumbers.push(byThisMobileNumber)
				this.shouldShow.notification = true
				this.notificationMode = 'otpProvider'
				this.otpCode = response.data[0]
				console.warn('this.otpCode: ', this.otpCode)
			})
		}
	},
	components: {
		AppHomePage,
		OtpVerification,
		Notification,
		ClockInOut,
		HistoryDashboard
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
* {
	font-family: 'Space Mono', monospace;
}
</style>
