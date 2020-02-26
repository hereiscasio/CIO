<template>
<!-- eslint-disable vue/no-v-html -->

   <div>
	<Portal to="logo" v-if="currentView !== 'startLogin'">
		<v-row justify="center" no-gutters>

			<v-col cols='4'><img src="@/assets/logo.svg"/></v-col>

			<v-col cols='8' class='d-flex justify-center flex-column'>

				<svg width='57.5' height='20' class='mb-1'>
					<use xlink:href="@/assets/sprite.svg#brand-name"></use>
				</svg>
				<span class='text-no-wrap primary--text subtitle-1' v-text='`Clock-in-out System`'/>

			</v-col>
		</v-row>
	</Portal>

	<v-sheet
	   	v-if='currentView === "beforeLogin"' class='wrapper--before-login' height='100vh'
	>
		<v-sheet max-width='230' class='mx-auto'>

			<PortalTarget name="logo"></PortalTarget>

			<h1 class='text-justify body-1 gray--text mx-auto'>
				To access the app, please click button below then type your phone number for registration
			</h1>
		</v-sheet>

		<v-footer fixed class='d-flex justify-center' height='100' color='transparent'>
			<v-btn
				@click="currentView = 'startLogin'" color="primary"
			>
				<svg width='18' height='18' class='mr-2'>
					<use xlink:href="@/assets/sprite.svg#pencil"></use>
				</svg>
				Sign in with phone
			</v-btn>
		</v-footer>
	</v-sheet>

	<StartLogin v-else-if='currentView === "startLogin"'/>

	<SuccessLogin v-else-if='currentView === "successLogin"'/>

   </div>
<!--eslint-enable-->
</template>

<script>
import SuccessLogin from './SuccessLogin.vue';
import StartLogin from './StartLogin.vue';

export default {
	data() {
		this.$subscribe('on-success-login', () => this.currentView = 'successLogin');

		return {
			currentView: 'beforeLogin'
		}
	},
	components: {
		SuccessLogin, StartLogin
	}
}
</script>

<style lang='scss' scoped>
.wrapper--before-login {
	background: url('~@/assets/bg--landing-page_mobile.png') no-repeat center bottom;
	background-size: contain;

	padding: 20% 0%;
	.v-btn {
		position: fixed;
		z-index: 999;
		bottom: 10%;
	}
}

@media (min-width: 564px) {
	.wrapper--before-login {
		background: url('~@/assets/bg--landing-page_desktop.png') no-repeat center bottom;
		background-size: 100% 50%;
	}
}
</style>