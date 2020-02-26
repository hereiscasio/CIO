<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	v-model="shouldShowDialog"
	persistent
	max-width="220"
>
<v-card color="primary" dark>



	<v-card-title>
	Load data... a moment...
	</v-card-title>
	<v-card-text>
	<v-progress-linear
		indeterminate
		color="white"
		class="mb-0"
	></v-progress-linear>
	</v-card-text>
</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
export default {
	data() {
		this.$subscribe(
			'force-to-show-loading', payload => this.shouldShowDialog = payload
		);
		return {
			shouldShowDialog: false
		}
	}
}
</script>