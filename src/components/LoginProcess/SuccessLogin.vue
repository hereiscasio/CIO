<template>
<!-- eslint-disable vue/no-v-html -->
<v-sheet
	class='wrapper--success-login' height='100vh'
>
	<h1 class='slogan d-block display-1 white--text text-center'>Welcome to CIO system</h1>

	<v-footer color='transparent' fixed class='justify-center d-flex pa-0 py-6 mx-auto'>

	<v-row justify="center" no-gutters>
		<svg width='192' height='66'>
			<use :xlink:href="getSvgPath('brand')"></use>
		</svg>
	</v-row>

	</v-footer>
</v-sheet>
<!--eslint-enable-->
</template>
<script>
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';
export default {
	mixins: [getSvgPathMixin],
}
</script>
<style lang='scss' scoped>
$baseImgURL: 'https://res.cloudinary.com/casio/image/upload/';
$mobileImgURL: $baseImgURL + 'c_scale,f_auto,q_auto,w_768' + '/v1/cio/' + 'bg_success_w768_yjokot';
$desktopImgURL: $baseImgURL + 'c_scale,f_auto,q_auto,w_1500' + '/v1/cio/' + 'bg_success_w1500_qex7eb';

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
	background: url($mobileImgURL) center center / cover no-repeat;
}
@media (min-width: 768px) {
	.wrapper--success-login {
		background: url($desktopImgURL) center center / cover no-repeat;
	}
}
</style>