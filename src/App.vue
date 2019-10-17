<template>
<v-app>
	<v-row
		v-if='shouldShowLoadingIndicator'
		justify='center' align='center' class='fill-height'
	>
		<v-progress-circular
		:size="50" :width="7" color="purple" indeterminate
		></v-progress-circular>
	</v-row>
	<router-view v-else class='pa-0 ma-0'/>
</v-app>
</template>

<script>
export default {
	data() {
		return {
			userCredential: undefined, // will be assign `null` by Firebase if he is not login
			shouldShowLoadingIndicator: true
		}
	},
	created() {
		/**
		 * TODO: TEST: only triggered on sign-in or sign-out.
		 * TODO: for who haven't login, he will see clock route first, then see login route
		 * , we now avoid this situation by using `setTimeout`
		 *
		 * CASE_A, CASE_B are possible ways that user accessing our App
		 */
		this.$firebase.auth().onAuthStateChanged(userCredential =>
		{
			console.log('userCredential = ', userCredential)
			this.userCredential = userCredential

			if(userCredential) {
				console.log('Success to register or User is signed in')
				if (this.$router.currentRoute.name !== 'clock') // CASE_A
				{
					this.$router.push({ path: '/' })
				}
			}
			else if (this.$router.currentRoute.name !== 'login') // CASE_B
			{
				this.$router.push({ path: 'login' })
			}
			setTimeout(() => (this.shouldShowLoadingIndicator = false), 1000)
		})
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
* {
	font-family: 'Space Mono', monospace;
}
/**
 * ︎⚙︎ avoid to "scroll bouncing" ( https://tinyurl.com/y62mvq6k )
 */
body, html {
	overflow: hidden !important;
	height: 100% !important;
}
/**
 * ⏏︎ Safari Bug:
 * v-application--wrap height can't be expanded by its directly child
 * the main reason is its directly parent, v-application, declare `display: flex`
 * WARNING:
 * do not declare `height: 100%;` below
 */
.v-application {
	min-width: 320px; // the min size of app = the width of iPhoneSE-like
	overflow-y: auto; // ⚙︎
	height: 100vh !important; // ⚙︎
	display: block !important; // ⏏︎
}
</style>
