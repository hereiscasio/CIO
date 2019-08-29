<template>
<!-- eslint-disable vue/no-v-html -->
<div id='root--calendar-to-show-history'>
	<v-date-picker
		v-model="selectedDateInCalendar"
		@click:date="onClickDateButton"
		data-testid='view--history-calendar'
		color='#3D5AFE' full-width :show-current='currentDateWithSeparator'
		:events='dateSetOfWorkingDays'
		event-color="green lighten-1"
	></v-date-picker>

	<RecordEditor
		v-if='shouldShowRecordEditor'
		:timeData='timeOfCurrentEditingRecord'
		@finish-record-editing='requestToUpdateRecord'
		@finish-record-adding='requestToAddNewRecord'
		@cancel-record-editing='toggleRecordEditor(false)'
		editTarget='clockInOut' no-built-in-trigger
	/>
</div>
<!--eslint-enable-->
</template>

<script>
import { API } from './../constants'
import TYPE from 'vue-types' // eslint-disable-line
import RecordEditor from './RecordEditor'
import { size } from 'lodash-core'
export default {
	data () {
		return {
			selectedDateInCalendar: this.getPreviousLatestOneIfNoTodayRecord(),
			shouldShowRecordEditor: false,
			timeOfCurrentEditingRecord: ['', '']
		}
	},
	beforeCreate() {
		this.currentDateWithSeparator = this.$helper.getCurrent().dateWithSeparator()
	},
	computed: {
		dateSetOfWorkingDays() {
			return this.$store.state.allRecordDates.map(date => this.$helper.stringWithSeparator(date, '-'))
		},
		selectedDateWithoutSeparator() {
			return this.$helper.removeDashAndReturnNumber(this.selectedDateInCalendar)
		}
	},
	methods: {
		toggleRecordEditor(onOrOff) {
			this.shouldShowRecordEditor = onOrOff
		},
		requestToUpdateRecord(editedRecord)
		{
			this.toggleRecordEditor(false)
			editedRecord.date = this.selectedDateWithoutSeparator

			this.$http.patch(API.TO_RECORD(editedRecord.date), editedRecord).then(({ data }) =>
			{
				this.$store.commit('PUT_RECORD', data)
			})
		},
		requestToAddNewRecord(newRecord)
		{
			this.toggleRecordEditor(false)
			newRecord.date = this.selectedDateWithoutSeparator

			this.$http.post(API.TO_RECORD(), newRecord).then(({ data }) =>
			{
				this.$store.commit('PUT_RECORD', data)
			})
		},
		getPreviousLatestOneIfNoTodayRecord() {
			if (
				this.$store.getters.haveTodayRecord()
			) {
				debugger
				return this.currentDateWithSeparator
			}
			debugger
			return this.$helper.stringWithSeparator(
				this.$store.getters.getPreviousLatestRecord(), '-'
			)
		},
		onClickDateButton (selectedDate)
		{
			const API_ENDPOINT = API.TO_RECORD(this.selectedDateWithoutSeparator)

			this.$http.get(API_ENDPOINT).then(({ data }) =>
			{
				this.toggleRecordEditor(true)
				if (size(data) !== 0) {
					this.$store.commit('PUT_RECORD', data)
					this.timeOfCurrentEditingRecord = [data.clockIn, data.clockOut]
					return
				}
				this.timeOfCurrentEditingRecord = ['', '']
			})
				.catch(error => {
					console.warn('FAIL: HTTP GET', error)
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