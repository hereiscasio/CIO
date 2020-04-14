import { text, boolean, object, array } from '@storybook/addon-knobs';
import HistoryInTable from '@/components/HistoryDashboard/HistoryInTable.vue';
export default {
	title: 'HistoryInTable'
}

const basicConfig = {
	template: `
		<HistoryInTable
			:recordsInFocusedMonth="records"
			:focusedMonthWithYear="focusedMonthWithYear"
		/>
	`,
	components: {
		HistoryInTable
	}
};

export const Default = () => ({
	props: {
		focusedMonthWithYear: {
			default: text('focusedMonthWithYear', '1990-07')
		},
		records: {
			default: []
		}
	},
	...basicConfig
})

export const WithFewRecords = () => ({
	props: {
		focusedMonthWithYear: {
			default: text('focusedMonthWithYear', '1990-07')
		},
		records: {
			default: array('records', [
				{
					date: '2020-02-03', clockIn: '12:03', clockOut: '23:48'
				},
				{
					date: '2020-02-04', clockIn: '11:00', clockOut: '23:22'
				}
			])
		}
	},
	...basicConfig
})