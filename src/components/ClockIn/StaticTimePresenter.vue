<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	width='100%' min-height='260' class='d-flex flex-column'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6 card--clock-in-out'
	>
	{{'Clock-' + dataType.slice(-2)}}
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
        <span class="time--time-freezer">
			{{record[dataType]}}
			<slot name='editing-button'/>
			<!--
				<RecordEditor
					:timeData='[record.clockIn]'
					:editTarget='dataType'
					v-on="$listeners"
				/>
			-->
		</span>
	</v-card-text>

	<v-card-actions class='justify-center py-4'>
		<span>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#calendar-range"></use>
			</svg>
			&nbsp;{{record.date}}
		</span>
	</v-card-actions>
</v-card>
<!--eslint-enable-->
</template>

<script>
import RecordEditor from '@/components/RecordEditor.vue';
import TYPE from 'vue-types' // eslint-disable-line
export default {
	components: {
		RecordEditor
	},
	props: ['record', 'dataType']
}
</script>

<style lang="scss" scoped>
.card--clock-in-out {
	font-size : 32px;
	background: var(--v-primary-base);
}
.v-card__text {
	font-family: krungthep;
	font-size: 63px;
	flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
.v-badge__badge .v-icon {
    font-size: 18px;
}
.time--time-freezer {
	position: relative; // a base to align trigger of "RecordEditor"
	font-family: krungthep;
}
</style>
