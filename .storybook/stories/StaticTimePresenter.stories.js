import { text, boolean, object, array } from '@storybook/addon-knobs';
import StaticTimePresenter from '@/components/ClockIn/StaticTimePresenter.vue';

export default {
	title: 'StaticTimePresenter'
}

export const Default = () => ({
	components: {
		StaticTimePresenter
	},
	props: {
		time: {
			default: text('time', '22:21')
		},
		date: {
			default: text('date', '2020-04-07')
		},
		title: {
			default: text('title', 'Clock-In')
		}
	},
	template: `
		<StaticTimePresenter
			:time="time"
			:date="date"
			:title="title"
		/>
	`
});