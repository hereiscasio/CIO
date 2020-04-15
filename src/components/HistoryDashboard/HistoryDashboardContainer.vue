<template>
<!-- eslint-disable vue/no-v-html -->
<HistoryDashboardLayout
	@onClickCalendarTab='fetchRecordsInFocusedMonth'
>

	<template v-slot:Calendar='{shouldShowCalendar}'>
		<HistoryInCalendar
			v-if='shouldShowCalendar'
			:recordDatesInFocusedMonth='recordDates'
			:focusedMonthWithYear='focusedMonthWithYear'
			@onSwitchMonthButton='fetchRecordsInFocusedMonth'
			@onClickRecordEditing='requestRecordOfTheDate'
		/>
	</template>

	<template v-slot:Table='{shouldShowTable}'>
		<HistoryInTable
			v-show='shouldShowTable'
			:recordsInFocusedMonth='records'
			:focusedMonthWithYear='focusedMonthWithYear'
			@onSwitchMonthButton='fetchRecordsInFocusedMonth'
			@onClickRecordEditing='requestRecordOfTheDate'
			@onClickRecordAdding='requestAddNewRecord'
		/>
	</template>

</HistoryDashboardLayout>

<!--eslint-enable-->
</template>

<script>
import format from 'date-fns/format';
import { dbService } from '@/helper/db.service.js';
import HistoryInCalendar from './HistoryInCalendar.vue';
import HistoryDashboardLayout from './HistoryDashboardLayout.vue';

export default {

	data () {
		return {
			recordDates: [],
			records: []
		}
	},

	computed: {
		focusedMonthWithYear () {
			return this.$store.state.focusedMonthWithYear;
		}
	},

	watch: {
		'$store.state.recordsInFocusedMonth': function(__records)
		{
			this.recordDates = __records ? Object.keys(__records) : [];
			this.records = __records ? Object.values(__records) : [];
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
	},

	components: {
		HistoryInTable: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "table" */ '@/components/HistoryDashboard/HistoryInTable.vue'),
		HistoryInCalendar,
		HistoryDashboardLayout
	}
}
</script>