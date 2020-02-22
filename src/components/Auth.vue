<template>
<!-- eslint-disable vue/no-v-html -->
<div id='outer-boundary'>

   <div
		v-if='shouldShowSubView.beforeAuth' id='boundary--before-auth'
	>
		<v-row justify="center" no-gutters>
			<v-col cols='12' class='mb-4 d-flex'>
				<img width='173' src="@/assets/logo.svg" class='mx-auto d-block'>
				<svg width='46' height='16' class='mx-auto d-block'>
					<use xlink:href="@/assets/sprite.svg#brand-name"></use>
				</svg>
			</v-col>
			<v-col cols='12'>
				<v-sheet max-width='232' class='text-justify body-2 gray--text mx-auto' color='transparent'>
					To access the app, please click button below then type your phone number for registration
				</v-sheet>
			</v-col>

			<v-btn
				id='button--before-auth' color="primary"
				@click="showViewOfStartAuth"
			>
				<svg width='18' height='18'>
					<use xlink:href="@/assets/sprite.svg#pencil"></use>
				</svg>
				Sign in with phone
			</v-btn>
		</v-row>
	</div>

	<v-row v-else-if='shouldShowSubView.startAuth' justify='center' align='center' class='fill-height'>
		<v-progress-circular
		v-if='shouldShowIndicator'
		indeterminate
		color="primary"
		></v-progress-circular>
		<div id="firebaseui-auth-container"></div>
	</v-row>

	<v-row
		id='sub-view--success-auth' v-else-if='shouldShowSubView.successAuth'
		justify="center" no-gutters class='fill-height'
	>
		<h1
			class='display-1 white--text text-center'
			style='margin-top: 25%'
		>Welcome to CIO system</h1>
		<v-img
			src="@/assets/logo.svg"
			max-width="173"
			id='logo--success-auth'
		></v-img>
	</v-row>
</div>

<!--eslint-enable-->
</template>
<script>
import * as firebaseui from 'firebaseui'

export default {
	data () {
		return {
			shouldShowSubView: {
				beforeAuth: true,
				startAuth: false,
				successAuth: false
			},
			shouldShowIndicator: true
		}
	},
	methods: {
		async memorizeUserPhoneNumberInHisDevice() {
			await this.$vlf.setItem('phoneNumber', this.$root.uid)
		},
		/**
		 * @note
		 * return `true` if want to automatically redirect
		 */
		signInSuccessWithAuthResult(authResult, redirectUrl)
		{
			console.warn('this.$firebase.auth.UserCredential: ', this.$firebase.auth.UserCredential)
			console.warn('authResult: ', authResult, 'redirectUrl: ', redirectUrl)

			this.$root.uid = authResult.user.phoneNumber

			this.shouldShowSubView.startAuth = false
			this.shouldShowSubView.successAuth = true

			this.memorizeUserPhoneNumberInHisDevice()

			setTimeout(() => {
				console.warn('count down 3 sec to redirect to other page')
				this.$router.push('/')
			}, 3000)

			return false
		},
		/**
		 *
		 * @note
		 * `authResult.user` = `firebase.auth.UserCredential`
		 */
		showViewOfStartAuth() {
			this.shouldShowSubView.beforeAuth = false
			this.shouldShowSubView.startAuth = true
			console.warn('this.$firebase.auth().currentUser: ', this.$firebase.auth().currentUser)

			this.$nextTick(() => {
				// Initialize the FirebaseUI Widget using Firebase
				this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.$firebase.auth())

				// The start method will wait until the DOM is loaded.
				this.ui.start('#firebaseui-auth-container', {
					callbacks: {
						signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
						uiShown: () => (this.shouldShowIndicator = false)
					},
					signInOptions: [
						{
							provider: this.$firebase.auth.PhoneAuthProvider.PROVIDER_ID,
							defaultCountry: 'TW',
							defaultNationalNumber: '09'
						}
					]
				})
			})
		}
	}
}
</script>
<style lang='scss' scoped>
@import '~firebaseui/dist/firebaseui.css';

#firebaseui-auth-container {
	margin-top: 10%;
}
#logo--success-auth {
	position: fixed;
	bottom: 5%;
}
#boundary--before-auth {
	padding: 20% 0%;
}
#button--before-auth {
	position: fixed;
	z-index: 999;
	bottom: 10%;
}
#outer-boundary {
	background: url('~@/assets/bg--landing-page_mobile.png') no-repeat center bottom;
	background-size: contain;
	height: 100vh;
}
@media (min-width: 600px) {
	#outer-boundary {
		background: url('~@/assets/bg--landing-page_desktop.png') no-repeat center bottom;
		background-size: 100% 50%;
	}
}
#sub-view--success-auth {
	background: url('~@/assets/bg--success-auth.png') no-repeat center center;
	background-size: cover;
}
</style>