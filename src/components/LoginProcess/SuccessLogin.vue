<template>
<!-- eslint-disable vue/no-v-html -->
<v-sheet
	class='wrapper--success-login' height='100vh'
>
	<v-img src='@/assets/bg--success-auth.png' height='100%' width='100%'></v-img>

	<h1 class='slogan d-block display-1 white--text text-center'>Welcome to CIO system</h1>

	<v-footer color='transparent' fixed class='justify-center d-flex pa-0 py-6 mx-auto'>

	<PortalTarget name="logo"></PortalTarget>

	</v-footer>
</v-sheet>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line
export default {

}
</script>

<style lang='scss' scoped>
.slogan {
	position: absolute;
	left: 0;
    right: 0;
    top: 20%;
}
.wrapper--success-login {
	position: relative;
	h1 {
		z-index: 1;
	}
	> .v-image {
		position: absolute;
	}
}
</style>