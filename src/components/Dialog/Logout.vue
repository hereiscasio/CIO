<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model="shouldShowDialog" max-width="320" transition="dialog-top-transition">
	<v-card>
		<v-card-title class="headline">ARE YOU SURE ?</v-card-title>

		<v-card-text>
			Once you confirm this operation,
			all your data can not be recovered + You need to
			run the registration process again
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				color="red" text class='font-weight-black' large
				@click="onVerifySignOut"
				v-text='`YES`'
			/>
			<v-btn
				class='grey--text mr-3' large text
				@click="shouldShowDialog = false"
				v-text='`CANCEL`'
			/>
		</v-card-actions>
	</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
export default {
	extends: require('./visibleMechanism.js').default,
	methods: {
		onVerifySignOut() {
			this.shouldShowDialog = false;
			this.$auth().signOut();
		}
	}
}
</script>