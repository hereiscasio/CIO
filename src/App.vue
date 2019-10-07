<template>
<v-app>
	<router-view/>
</v-app>
</template>

<script>
export default {
	beforeCreate() {
		/*
		 * temporarily comment out
		 * this.$router.push({ path: 'landing' })
		 * DEPRECATED
		 */
		//localStorage.setItem('userId', '0966001596')
		/**
		 * Go view: sign-up if haven't registered, otherwise redirect to view: logged
		 * DEPRECATED
		 */
		/*
		 * if (localStorage.userId === undefined) {
		 * 	this.$router.replace({ path: 'signup' })
		 * }
		 */
		/**
		 * @todo
		 * TEST: only triggered on sign-in or sign-out.
		 * @note
		 * `userCredential` will be `null` if user is logout
		 */
		this.$firebase.auth().onAuthStateChanged(userCredential =>
		{
			console.warn('userCredential = ', userCredential)

			if(userCredential) {
				console.warn('Success to register or User is signed in')
				return
			}
			this.$router.push({ path: 'login' })
		})
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
