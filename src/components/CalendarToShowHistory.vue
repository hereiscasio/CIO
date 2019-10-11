<template>
<!-- eslint-disable vue/no-v-html -->
<div id='root--calendar-to-show-history'>
	<v-date-picker
		v-model="selectedDateInCalendar"
		@click:date="onClickDateButton"
		data-testid='view--history-calendar'
		color='#3D5AFE' full-width :show-current='dateOfTodayIndicator'
		:events='dateSetOfWorkingDays'
		event-color="green lighten-1"

	></v-date-picker>

	<RecordEditor
		v-if='shouldShowRecordEditor'
		:timeData='timeOfCurrentEditingRecord'
		@finish-record-editing='updateRecord'
		@finish-record-adding='updateRecord'
		@cancel-record-editing='shouldShowRecordEditor = false'
		editTarget='clockInOut' no-built-in-trigger
	/>
</div>
<!--eslint-enable-->
</template>

<script>
import RecordEditor from './RecordEditor'
import { flatMap, values } from 'lodash-core'

export default {
	data () {
		return {
			selectedDateInCalendar: '',
			shouldShowRecordEditor: false,
			timeOfCurrentEditingRecord: ['', ''],
			dateSetOfWorkingDays: []
		}
	},
	created() {
		this.initializeDataIntoCalendar()
	},
	computed: {
		selectedDateWithoutSeparator() {
			return this.$helper.removeDashAndReturnNumber(this.selectedDateInCalendar)
		}
	},
	methods: {
		/**
		 *	TODO: the way to detect RTDB data change below still not a best strategy
		 */
		initializeDataIntoCalendar ()
		{
			this.dateOfTodayIndicator = this.$helper.getCurrent().dateWithSeparator()
			this.selectedDateInCalendar = this.dateOfTodayIndicator

			this.$db.ref(this.$root.uid).on('value', snapshot =>
			{
				const records = flatMap(snapshot.val(), value => values(value))
				const dateFormater = date => this.$helper.stringWithSeparator(date, '-')
				this.dateSetOfWorkingDays = records.map(record => dateFormater(record.date))
			})
		},

		updateRecord(editedRecord)
		{
			this.shouldShowRecordEditor = false

			editedRecord.date = this.selectedDateWithoutSeparator

			this.dataRefInDB().update({ [editedRecord.date]: editedRecord })
		},

		dataRefInDB (date)
		{
			const dateWithoutDay = Number(
				(date || this.selectedDateWithoutSeparator).toString().slice(0, 6)
			)
			return this.$db.ref(
				this.$root.uid + '/' + dateWithoutDay
			)
		},

		onClickDateButton ()
		{
			this.dataRefInDB().child(this.selectedDateWithoutSeparator).once('value', snapshot =>
			{
				const record = snapshot.val()

				this.shouldShowRecordEditor = true

				if (record) {
					this.timeOfCurrentEditingRecord = [record.clockIn, record.clockOut]
					return
				}
				this.timeOfCurrentEditingRecord = ['', '']
			})
		}
	},
	components: { RecordEditor }
}
</script>

<style lang='scss' scoped>
#root--calendar-to-show-history, .v-picker--date {
	height: 100%;
}
</style>