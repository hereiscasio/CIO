import { action } from '@storybook/addon-actions';
import { text, boolean, object, array } from '@storybook/addon-knobs';
import RecordEditor from '@/components/Dialog/RecordEditor.vue';

export default {
	title: 'RecordEditor'
}

const basicSetup = {
	template: `<RecordEditor :payload='record' @onHideDialog='onHideDialog'/>`,
	methods: {
		onHideDialog: action('hide dialog')
	},
	components: {
		RecordEditor
	},
};

export const AddNewRecordByCreating = () => ({
	props: {
		record: {
			default: object('record', {
				date: '',
				clockIn: '',
				clockOut: ''
			})
		}
	},
	...basicSetup
})

export const AddNewRecordByModifying = () => ({
	props: {
		record: {
			default: object('record', {
				date: '2020-04-07',
				clockIn: '',
				clockOut: ''
			})
		}
	},
	...basicSetup
})

export const ModifyClockInTime = () => ({
	props: {
		record: {
			default: object('record', {
				date: '2020-04-07',
				clockIn: '22:30'
			})
		}
	},
	...basicSetup
})

export const ModifyExistedRecord = () => ({
	props: {
		record: {
			default: object('record', {
				date: '2020-04-07',
				clockIn: '22:30',
				clockOut: ''
			})
		}
	},
	...basicSetup
})
