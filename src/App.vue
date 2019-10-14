<template>
<v-app>
	<v-row
		v-if='userCredential === undefined'
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
			userCredential: undefined // will be assign `null` by Firebase if he is not login
		}
	},
	created() {
		/**
		 * TODO:
		 * 		TEST: only triggered on sign-in or sign-out.
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
				return
			}
			if (this.$router.currentRoute.name !== 'login') // CASE_B
			{
				this.$router.push({ path: 'login' })
			}
		})
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
* {
	font-family: 'Space Mono', monospace;
}
.v-application {
	min-width: 320px;
}
</style>
