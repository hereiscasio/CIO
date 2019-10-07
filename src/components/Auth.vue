<template>
<!-- eslint-disable vue/no-v-html -->
		<div style='height:100%' id='outer-boundary'>

   <div
		v-if='shouldShowSubView.beforeAuth' id='boundary--before-auth'
	>
		<v-row justify="center" no-gutters>
			<v-col cols='12' class='mb-4'>
				<v-img
					src="@/assets/logo.svg"
					max-width="173" class='mx-auto'
				></v-img>
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
				<v-icon left>phone</v-icon>Sign in with phone
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
		showViewOfStartAuth() {
			this.shouldShowSubView.beforeAuth = false
			this.shouldShowSubView.startAuth = true
			// console.warn('this.$firebase.auth().currentUser: ', this.$firebase.auth().currentUser)
			this.$nextTick(() => {
				// only triggered on sign-in or sign-out.
				this.$firebase.auth().onAuthStateChanged(user =>
				{
					if(user) {
						console.warn('Success to register or User is signed in, user = ', user)
					} else {
						console.warn('Enter your phone number')
					}
				})
				/**
				 * Initialize the FirebaseUI Widget using Firebase
				 */
				const ui = new firebaseui.auth.AuthUI(this.$firebase.auth())
				/**
				 * The start method will wait until the DOM is loaded.
				 * @todo
				 * TEST: `this.$firebase.auth.UserCredential` = `authResult`
				 */
				ui.start('#firebaseui-auth-container',
					{
						/**
						 * return `true` if want to automatically redirect
						 */
						callbacks: {
							signInSuccessWithAuthResult: (authResult, redirectUrl) => {
								console.warn('this.$firebase.auth.UserCredential: ', this.$firebase.auth.UserCredential);
								console.warn('authResult: ', authResult, 'redirectUrl: ', redirectUrl);
								this.shouldShowSubView.startAuth = false
								this.shouldShowSubView.successAuth = true

								setTimeout(() => {
									console.warn('count down 3 sec to redirect to other page')
									this.$router.push('/')
								}, 3000)
							},
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
#bg--before-auth {
	position: fixed;
	bottom: 0;
}
#button--before-auth {
	position: fixed;
	z-index: 999;
	bottom: 10%;
}
#outer-boundary {
	background: url('~@/assets/bg--landing-page_mobile.png') no-repeat center bottom;
	background-size: contain;
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