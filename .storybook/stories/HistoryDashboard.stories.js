import { action } from '@storybook/addon-actions';
import HistoryDashboard from '@/components/HistoryDashboard/HistoryDashboard.vue';

export default {
	title: 'HistoryDashboard'
}

export const Default = () => ({
	template: `
		<HistoryDashboard
			:recordDatesInFocusedMonth='recordDatesInFocusedMonth'
			:recordTimesInFocusedMonth='recordTimesInFocusedMonth'
			:focusedMonthWithYear='focusedMonthWithYear'
			@onSwitchMonthButton='fetchRecordsInFocusedMonth'
			@onClickRecordEditing='requestRecordOfTheDate'
			@onClickRecordAdding='requestAddNewRecord'
		/>
	`,

	created () {
		this.focusedMonthWithYear = '2020-02';
		this.recordDatesInFocusedMonth = ['2020-02-03', '2020-02-24'];
		this.recordTimesInFocusedMonth = [{
			date: '2020-02-03', clockIn: '12:03', clockOut: '23:48',
			date: '2020-02-24', clockIn: '11:30', clockOut: '12:25',
		}]
	},

	methods: {
		requestAddNewRecord: action('requestAddNewRecord'),
		requestRecordOfTheDate: action('requestRecordOfTheDate'),
		fetchRecordsInFocusedMonth: action('fetchRecordsInFocusedMonth')
	},

	components: {
		HistoryDashboard
	}
})