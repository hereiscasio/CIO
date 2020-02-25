<template>
<!-- eslint-disable vue/no-v-html -->
<v-date-picker
	v-model="selectedDateOnCalendar"
	@click:date="$emit('onClickDateButton', arguments[0])"
	color='#3D5AFE' full-width :show-current='dateOfTodayIndicator'
	:events='events' scrollable
	event-color="green lighten-1"
	ref='datePicker'
></v-date-picker>
<!--eslint-enable-->
</template>

<script>
import { addMonths, parse, format } from 'date-fns';

export default {
	props: ['events'],

	data () {
		return {
			selectedDateOnCalendar: ''
		}
	},

	created() {
		this.initializeDataIntoCalendar();
	},

	methods: {
		initializeDataIntoCalendar ()
		{
			this.dateOfTodayIndicator = format(Date.now(), 'yyyy-LL-dd');
			this.selectedDateOnCalendar = this.dateOfTodayIndicator;
		}
	},

	mounted() {
		const monthSwitcherElementClass = '.v-date-picker-header .v-btn';
		const $buttons = this.$refs.datePicker.$el.querySelectorAll(monthSwitcherElementClass);
		const [$nextBtn, $prevBtn] = [$buttons[1], $buttons[0]];

		$nextBtn.addEventListener('click', async e =>
		{
			const {getRecordsInCertainMonth} = require('@/services/db.service.js').default;
			const dateStr = parse(this.selectedDateOnCalendar, 'yyyy-LL-dd', new Date());

			const nextMonthRecords = await getRecordsInCertainMonth(
				format(addMonths(dateStr, 1), 'yyyy-LL')
			);


		});
		$prevBtn.addEventListener('click', e => {
			console.warn(e);
		});
	}
}
</script>

<style lang='scss' scoped>
.v-picker--date {
	height: 100%;
	border-radius: 0 !important;
}
</style>