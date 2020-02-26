<template>

<v-dialog v-model='shouldShowDialog' fullscreen transition="dialog-bottom-transition" persistent>
<v-overlay :value='true'>

	<v-card color='transparent' tile class='d-flex justify-center align-center'>
		<v-progress-circular
				v-if='shouldShowLoadingIndicator' indeterminate color="primary"
		></v-progress-circular>

		<div id="firebaseui-container"/>
	</v-card>

</v-overlay>
</v-dialog>

<!--eslint-enable-->
</template>

<script>
import * as firebaseui from 'firebaseui';

export default {
	data() {
		return {
			shouldShowLoadingIndicator: true,
			shouldShowDialog: true
		}
	},

	created() {
		const cb = () =>
		{
			const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.$auth());
			const config = {
				callbacks: {
					signInSuccessWithAuthResult: () =>
					{
						this.shouldShowDialog = false;
						this.$fire('on-success-login');
						setTimeout(() => this.$router.push('/'), 3000);
						return false;
					},
					// The widget is rendered, hide the loader.
					uiShown: () => (this.shouldShowLoadingIndicator = false)
				},
				signInOptions: [
					{
						provider: this.$auth.PhoneAuthProvider.PROVIDER_ID,
						defaultCountry: 'TW',
						defaultNationalNumber: '09'
					}
				]
			};
			// The start method will wait until the DOM is loaded.
			ui.start('#firebaseui-container', config);
		};
		this.$nextTick(cb);
	}
}
</script>

<style lang='scss' scoped>
@import '~firebaseui/dist/firebaseui.css';

#firebaseui-container {
	::v-deep .mdl-card {
		border-top: 2px solid rgb(241, 240, 240);
		box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22) !important;
	}
}
</style>