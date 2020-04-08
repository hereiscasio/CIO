<template>
<!-- eslint-disable vue/no-v-html -->
<HistoryDashboard
	:recordDatesInFocusedMonth='recordDatesInFocusedMonth'
	:recordTimesInFocusedMonth='recordTimesInFocusedMonth'
	:focusedMonthWithYear='focusedMonthWithYear'
	@onSwitchMonthButton='fetchRecordsInFocusedMonth'
	@onClickRecordEditing='requestRecordOfTheDate'
	@onClickRecordAdding='requestAddNewRecord'
/>
<!--eslint-enable-->
</template>

<script>
import HistoryDashboard from './HistoryDashboard.vue';
import format from 'date-fns/format';
import { dbService } from '@/helper/db.service.js';

export default {

	computed: {
		focusedMonthWithYear () {
			return this.$store.state.focusedMonthWithYear;
		},

		recordDatesInFocusedMonth()
		{
			const records = this.$store.state.recordsInFocusedMonth;
			if (!records) return [];
			return Object.keys(records);
		},
		// TODO:
		// not a good name
		// i.e. checkout its data format and compare with
		// `recordsInFocusedMonth` in store
		recordTimesInFocusedMonth()
		{
			const records = this.$store.state.recordsInFocusedMonth;
			if (!records) return [];
			return Object.values(records);
		}
	},

	methods: {
		requestAddNewRecord()
		{
			const record = {date: '', clockIn: '', clockOut: ''};
			this.$fire('request-dialog', 'record-editor', {...record});
		},

		requestRecordOfTheDate(date)
		{
			const record = {
				...{date, clockIn: '', clockOut: ''},
				...this.$store.state.recordsInFocusedMonth[date]
			};
			this.$fire('request-dialog', 'record-editor', {...record});
		},

		/**
		 * example of `TargetURL` :
		 * https://ciosystem.firebaseio.com/+886966001596/2020-02/2020-02-13.json?shallow=true
		 */
		async fetchRecordsInFocusedMonth(monthWithYear)
		{
			this.$store.commit(
				'SET_FOCUSED_MONTH_WITH_YEAR',
				monthWithYear ? monthWithYear : format(Date.now(), 'yyyy-LL')
			);
			this.$fire('request-dialog', 'loading', true);
			await dbService.trackRecordsInFocusedMonth(monthWithYear);
			this.$fire('request-dialog', '', '');
		}
	},

	created() {
		this.fetchRecordsInFocusedMonth();
		this.$subscribe('on-click-calendar-tab', this.fetchRecordsInFocusedMonth);
	},

	components: {
		HistoryDashboard
	}
}
</script>