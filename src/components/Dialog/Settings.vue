<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model="shouldShowDialog" fullscreen transition="dialog-bottom-transition">
	<v-card flat tile color='black' dark class='pa-4 pt-12'>
		<v-btn
			color='primary' fab dark absolute right top text
			@click="shouldShowDialog = false"
			class='mt-10' small
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
							Built by Casio, a senior frontend developer.
							All right preserved. For source
							code, check this
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<v-row no-gutters>
				<v-col>
					<v-card color='transparent'>
						<v-card-title>Suggestions</v-card-title>
						<v-card-text>
							Feel free to contact me at
							<v-chip
								class="ma-2" color="primary" small
								@click='require("clipboard-copy")("hereiscasio@gmail.com")'
							>
								hereiscasio@gmail.com
								<svg width='16' height='16' class='ml-2'>
									<use xlink:href="@/assets/sprite.svg#content-copy"></use>
								</svg>
							</v-chip>
						</v-card-text>
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
export default {
	extends: require('./visibleMechanism.js').default
}
</script>