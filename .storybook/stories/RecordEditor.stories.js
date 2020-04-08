import { text, boolean, object, array } from '@storybook/addon-knobs';
import RecordEditor from '@/components/Dialog/RecordEditor.vue';

export default {
	title: 'RecordEditor'
}

export const AddNewRecord = () => ({
	components: {
		RecordEditor
	},
	props: {
		record: {
			default: object('record', {
				date: '',
				clockIn: '',
				clockOut: ''
			})
		}
	},
	template: `<RecordEditor :payload='record'/>`
})

export const ModifyClockInTime = () => ({
	components: {
		RecordEditor
	},
	props: {
		record: {
			default: object('record', {
				date: '2020-04-07',
				clockIn: '22:30'
			})
		}
	},
	template: `<RecordEditor :payload='record'/>`
})

export const ModifyAnRecord = () => ({
	components: {
		RecordEditor
	},
	props: {
		record: {
			default: object('record', {
				date: '2020-04-07',
				clockIn: '22:30',
				clockOut: ''
			})
		}
	},
	template: `<RecordEditor :payload='record'/>`
})
