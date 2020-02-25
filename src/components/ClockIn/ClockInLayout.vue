<template>
<v-row
	justify="center" no-gutters :style='setGradientBackground()'
	:align-content='$vuetify.breakpoint.smAndUp ? "center" : "start"'
>
	<!-- nested-child-route: HistoryDashboardContainer.vue -->
	<router-view></router-view>

	<v-col
		cols='12' class='pa-0'
	>
		<slot name='clockWidget'></slot>
	</v-col>

	<v-col cols='12' class='px-4'>
		<div
			:class='`d-flex mx-auto ${$vuetify.breakpoint.smAndUp ? "flex-row" : "flex-column"}`'
			:style='{"max-width": maxWidthOfCards}'
		>
			<slot name='clockInCard'></slot>

			<v-responsive :width='virtualSpaceBetweenCards'></v-responsive>

			<slot name='clockOutCard'></slot>
		</div>
	</v-col>
</v-row>
</template>
<script>

export default {
	props: ['todayRecord'],

	computed: {
		maxWidthOfCards()
		{
			return this.$vuetify.breakpoint.smAndUp ?
				(this.todayRecord ? '593px' : '516px') : '100%'
		},

		virtualSpaceBetweenCards() {
			return this.maxWidthOfCards === '593px' ? 16 : 0;
		}
	},

	methods: {
		/**
		 * TODO: setup color by using Vuetify API
		 */
		setGradientBackground ()
		{
			const imgURI = require('trianglify')({
				cell_size: 25,
				seed: 'av7k8',
				x_colors: 'random',
				variance: '0.76'

			}).png()

			return { 'background': `url( ${imgURI} ) no-repeat center/100% 100%` }
		}
	}
}
</script>

<style lang='scss' scoped>

@media (min-width: 563px) { // if >= 564, then ...
	.rwd-wrapper--card {
		max-width: 312px;
		padding-right: 8px !important;
		padding-left: 8px !important;

		&:nth-child(2) {
			padding-left: 16px !important;
		}
		&:nth-child(3) {
			padding-right: 16px !important;
		}
	}

}
</style>