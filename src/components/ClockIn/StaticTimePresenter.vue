<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	width='100%' min-height='260' class='d-flex flex-column'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6 card--clock-in-out'
	>
	{{title}}
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
        <span class="time--time-freezer">
			{{time}}
			<svg
				@click="$emit('onClickEditBtn')" width='18' height='18' class='icon-btn'
			>
				<use :xlink:href="getSvgPath('pencil')"></use>
			</svg>
		</span>
	</v-card-text>

	<v-card-actions class='justify-center py-4'>
		<span class='d-flex'>
			<svg width='24' height='24' class='mr-2'>
				<use :xlink:href="getSvgPath('calendar-range')"></use>
			</svg>
			{{date}}
		</span>
	</v-card-actions>
</v-card>
<!--eslint-enable-->
</template>

<script>
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';

export default {
	mixins: [getSvgPathMixin],
	props: ['time', 'date', 'title']
}
</script>

<style lang="scss" scoped>
.card--clock-in-out {
	font-size : 32px;
	background: var(--v-primary-base);
}
.v-card__text {
	font-family: krungthep !important;
	font-size: 63px;
	flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
.v-badge__badge .v-icon {
    font-size: 18px;
}
.time--time-freezer {
	position: relative; // a base to align trigger of "RecordEditor"
	font-family: krungthep !important;
}
.icon-btn {
	cursor: pointer;
	position: absolute;
	top: -100%;
	right: -10%;
	width: 34px;
	height: 34px;
	padding: 8px;
	margin-top: -8px;
	margin-right: -8px;
}
</style>
