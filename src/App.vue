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
		// if (localStorage.userId === undefined) {
		// 	this.$router.replace({ path: 'signup' })
		// }
		/**
		 * @todo
		 * TEST: `user` will be `null` if logout
		 */
		this.$firebase.auth().onAuthStateChanged(userCredential =>
		{
			if(userCredential) {
				console.warn('Success to register or User is signed in, where `userCredential` is ', userCredential)
			} else {
				console.warn('User is logout')
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
.v-application--wrap {
	background: white;
}
</style>
