<template>
<!-- eslint-disable vue/no-v-html -->
   <div>

	<v-sheet
		v-if='!(currentView === "successLogin")'
	   	class='wrapper--before-login' height='100vh'
	>
		<v-sheet max-width='230' class='mx-auto'>

			<v-row justify="center" no-gutters>
				<svg width='192' height='66'>
					<use :xlink:href="getSvgPath('brand')"></use>
				</svg>
			</v-row>

			<h1 class='text-justify body-1 gray--text mx-auto'>
				To access the app, please click button below then type your phone number for registration
			</h1>
		</v-sheet>

		<v-footer fixed class='d-flex justify-center' height='100' color='transparent'>
			<v-btn
				@click="currentView = 'startLogin'" color="primary"
			>
				<svg width='18' height='18' class='mr-2'>
					<use :xlink:href="getSvgPath('pencil')"></use>
				</svg>
				Sign in with phone
			</v-btn>
		</v-footer>
	</v-sheet>

	<StartLogin v-if='currentView === "startLogin"'/>

	<SuccessLogin v-show='currentView === "successLogin"'/>

   </div>
<!--eslint-enable-->
</template>

<script>
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';
export default {
	mixins: [getSvgPathMixin],
	data() {
		this.$subscribe('on-success-login', () => this.currentView = 'successLogin');

		return {
			currentView: ''
		}
	},
	components: {
		/**
		 * TODO: how to use `webpackPrefetch` with `v-if` ?
		 */
		SuccessLogin: () => import(/* webpackChunkName: "success_login" */ '@/components/LoginProcess/SuccessLogin.vue'),
		StartLogin: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "start_login" */ '@/components/LoginProcess/StartLogin.vue')
	}
}
</script>

<style lang='scss' scoped>
$baseImgURL: 'https://res.cloudinary.com/casio/image/upload/';
$mobileImgURL: $baseImgURL + 'c_scale,f_auto,q_auto,w_768' + '/v1/cio/' + 'bg_home_w768_xyyde6';
$desktopImgURL: $baseImgURL + 'c_scale,f_auto,q_auto,w_1680' + '/v1/cio/' + 'bg_home_w1680_b3ysis';

/**
	TODO: for ♻︎
	Below default font overlappings just a quick hack
	this should be done by "Vuetify's way"
	but this is not necessary now due to not so many
	requirements for overlapping default sass variables in Vuetify
*/

.subtitle-1 {
	font-family: 'Space Mono' !important; // ♻︎
}

.wrapper--before-login {
	padding: 20% 0%;

	h1 {
		font-family: 'Space Mono' !important; // ♻︎
	}

	.v-sheet {
		z-index: 1;
		position: relative;
		background-color: transparent;
	}
	.v-btn {
		position: fixed;
		z-index: 999;
		bottom: 10%;
	}

	background: url($mobileImgURL) center bottom / contain no-repeat;
}

@media (min-width: 768px) {
	.wrapper--before-login {
		background: url($desktopImgURL) center bottom / 100% 50% no-repeat;
	}
}
@media (min-width: 1440px) {
	.wrapper--before-login {
		padding: 10% 0%;
	}
}
</style>