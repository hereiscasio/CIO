<template>
<!-- eslint-disable vue/no-v-html -->
<v-menu offset-y close-on-click bottom max-width='164'>
	<template v-slot:activator="{ on }">
		<v-btn
			id='button--menu-on-clock'
			v-on="on" text fab dark :ripple='false'
		>
			<svg width='40' height='40'>
				<use xlink:href="@/assets/sprite.svg#menu"></use>
			</svg>
		</v-btn>
	</template>
	<v-list>
		<v-list-item
			v-for="(item, index) in featureListing" :key="index"
			@click='item.trigger'
		>
			<v-list-item-icon class='mr-4'>
				<svg width='24' height='24'>
					<use :xlink:href="require('@/assets/sprite.svg') + '#' + item.icon"></use>
				</svg>
			</v-list-item-icon>
			<v-list-item-title v-text='item.feature'></v-list-item-title>
		</v-list-item>
	</v-list>
</v-menu>
<!--eslint-enable-->
</template>

<script>
export default {
	props: ['featureListing']
}
</script>

<style lang='scss' scoped>
#button--menu-on-clock {
	position: absolute;
	top: 0;
	&::before {
		content: none; // remove special effect: ripple related stuff
	}
}
</style>