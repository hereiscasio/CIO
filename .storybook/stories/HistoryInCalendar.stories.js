import { text, boolean, object, array } from '@storybook/addon-knobs';
import HistoryInCalendar from '@/components/HistoryDashboard/HistoryInCalendar.vue';

export default {
	title: 'HistoryInCalendar'
}

export const Default = () => ({
	components: {
		HistoryInCalendar
	},
	props: {
		focusedMonthWithYear: {
			default: text('focusedMonthWithYear', '1990-07')
		},
		recordDates: {
			default: ['1990-07-03', '1990-07-04']
		}
	},
	template: `
		<HistoryInCalendar
			:recordDatesInFocusedMonth='recordDates'
			:focusedMonthWithYear='focusedMonthWithYear'
		/>
	`
})