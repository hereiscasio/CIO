<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model="shouldShowDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
	<v-card flat tile color='black' dark class='pa-4 pt-12'>
		<v-btn
			color='#3D5AFE' fab dark absolute right top text large
			@click="shouldShowDialog = false"
			class='mt-10'
		>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#close"></use>
			</svg>
		</v-btn>
		<v-container>
			<v-row no-gutters>
				<v-col>
					<v-card color='transparent'>
						<v-card-title>Credit</v-card-title>
						<v-card-text>
							Built by independent fullstack developer:
							Casio, all right preserved. For source
							code, check this
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col>
					<v-card color='transparent'>
						<v-card-title>Suggestions</v-card-title>
						<v-card-text>Feel free to contact at hereiscasio@gmail.com</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col>
					<v-card color='transparent'>
						<v-card-title>System Information</v-card-title>
						<v-card-text>. . .</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>

	</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line

export default {
	data() {
		this.$subscribe(
			'force-to-show-settings', () => this.shouldShowDialog = true
		);
		return {
			shouldShowDialog: false
		}
	}
}
</script>