<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	tile class="mx-auto outer-wrapper" height="100%" width="196" elevation='10'
>
	<v-navigation-drawer class="transparent" dark permanent>
		<v-list dense>
		<v-list-item
			v-for="item in featureListing" :key="item.icon" link
		>
			<v-list-item-content>
			<v-btn outlined tile x-large @click='item.trigger'>
				<svg width='24' height='24' class='mr-2 ml-n2'>
					<use :xlink:href="require('@/assets/sprite.svg') + '#' + item.icon"></use>
				</svg>
				{{ item.feature }}
			</v-btn>
			</v-list-item-content>
		</v-list-item>
		</v-list>

		<template v-slot:append>
			<div id='digital-time--landscape' v-text='currentTime' />
		</template>
	</v-navigation-drawer>
</v-card>
<!--eslint-enable-->
</template>

<script>
export default {
	props: ['featureListing', 'currentTime']
}
</script>

<style lang='scss' scoped>
$shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
.outer-wrapper {
	padding-top: 32px;
	background: var(--v-primary-base);
	background: linear-gradient(0deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
	box-shadow: $shadow;
	border-radius: 0 !important;
}
@media (min-width: 563px) { // if >= 564, then ...
	#digital-time--landscape {
		font-size: 50px;
		text-align: center;
		font-family: krungthep !important;
		color: white;
		padding-bottom: 8px;
	}
}
</style>