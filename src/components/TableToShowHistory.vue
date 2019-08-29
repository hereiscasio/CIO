<template>
<!-- eslint-disable vue/no-v-html -->
<div>
	<v-data-table
		data-testid='view--history-table'
		:headers="tableHeaders"
		:items="tableItems"
		:page.sync="currentFocusedPage"
		:items-per-page="10"
		hide-default-footer
		sort-by="date" style='margin-bottom: 128px'
		@page-count="numberOfPages = $event"
	>
		<template v-slot:top>
			<v-toolbar flat color="white">
			<v-toolbar-title class='headline font-weight-black'>{{tableTitle}}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn @click='onClickButtonOfItemAdding' color='primary'><v-icon left>add</v-icon> History</v-btn>
			</v-toolbar>
		</template>

		<template v-slot:item.action="{ item }">
			<v-icon
				small @click='onClickButtonOfItemEditing(item)' v-text='`edit`'
			/>
		</template>
		<!--
			TODO: list all items in order
			TODO: should show all available records in this month when access this view
		-->
		<template v-slot:item.date="{ item }">
			{{item.date.toString().slice(6, 8)}}
		</template>
	</v-data-table>

	<v-footer
		absolute style='margin-bottom: 64px' color='transparent'
		ref='buttonOfMonthSwitching' @hook:mounted="adjustTableSpacing"
	>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickButtonOfPrevMonth'>
			<v-icon dark>keyboard_arrow_left</v-icon>
		</v-btn>

		<v-subheader>{{showMonthAsEnglishFormat.prevMonth}}</v-subheader>
		<v-spacer></v-spacer>
		<v-subheader>{{showMonthAsEnglishFormat.nextMonth}}</v-subheader>

		<v-btn class="px-0" min-width='36' color='white' @click='onClickButtonOfNextMonth'>
			<v-icon dark>keyboard_arrow_right</v-icon>
		</v-btn>
	</v-footer>

	<RecordEditor
		v-if='shouldShowRecordEditor'
		:timeData='timeOfCurrentEditingRecord'
		@finish-record-editing='requestToUpdateRecord'
		@finish-record-adding='requestToAddNewRecord'
		@cancel-record-editing='toggleRecordEditor(false)'
		editTarget='clockInOut' no-built-in-trigger
		usedWithTable
	/>
</div>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line
import { format } from 'date-fns'
import { size } from 'lodash-core'
import RecordEditor from './RecordEditor'
import { API } from './../constants'
export default {
	data () {
		return {
			currentFocusedPage: 1, // FIXME: hard code
			numberOfPages: 0, // init
			currentMonthWithYear: this.combineMonthWithYear(),
			timeOfCurrentEditingRecord: ['', ''],
			shouldShowRecordEditor: false,
			dateOfCurrentEditingRecord: ''
		}
	},
	created() {
		// TODO: filter `date` to only show 2 number not whole date
		this.tableHeaders = [
			{
				text: 'Date', align: 'left', value: 'date'
			},
			{ text: 'Clock-in', value: 'clockIn' },
			{ text: 'Clock-out', value: 'clockOut' },
			{ text: 'Action', value: 'action' }
		]
	},
	methods: {
		adjustTableSpacing() {
			// this.$refs.buttonOfMonthSwitching.$el.clientHeight
		},
		onClickButtonOfPrevMonth()
		{
			let currentYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear
			let currentMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1
			const monthWithYear = this.combineMonthWithYear(currentYear, currentMonth)
			this.currentFocusedPage = this.currentFocusedPage - 1

			this.$http.get(API.RECORDS_IN_MONTH(monthWithYear)).then(({ data }) =>
			{
				size(data) && this.$store.commit('PUT_MULTIPLE_RECORDS', data)
				// FIXME: not work if over next year
				this.currentMonthWithYear = monthWithYear
			}).catch(error => {
				console.warn('FAIL: HTTP GET', error)
				/*
				 * TODO: json-server should return `null` if no data existed ?
				 * if (error.response.status === 404) {
				 * }
				 */
			})
		},
		onClickButtonOfNextMonth()
		{
			let currentYear = this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear
			let currentMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1
			const monthWithYear = this.combineMonthWithYear(currentYear, currentMonth)
			this.currentFocusedPage = this.currentFocusedPage + 1

			this.$http.get(API.RECORDS_IN_MONTH(monthWithYear)).then(({ data }) =>
			{
				size(data) && this.$store.commit('PUT_MULTIPLE_RECORDS', data)
				// FIXME: not work if over next year
				this.currentMonthWithYear = monthWithYear
			}).catch(error => {
				console.warn('FAIL: HTTP GET', error)
				/*
				 * TODO: json-server should return `null` if no data existed ?
				 * if (error.response.status === 404) {
				 * }
				 */
			})
		},
		toggleRecordEditor(onOrOff) {
			this.shouldShowRecordEditor = onOrOff
		},
		requestToUpdateRecord(editedResult)
		{
			this.toggleRecordEditor(false)

			editedResult.date = this.dateOfCurrentEditingRecord

			this.$http.patch(API.TO_RECORD(editedResult.date), editedResult).then(({ data }) =>
			{
				this.$store.commit('PUT_RECORD', data)
				this.dateOfCurrentEditingRecord = ''
			})
		},
		/**
		 * add new record in Table
		 */
		requestToAddNewRecord(record)
		{
			this.toggleRecordEditor(false)

			record.date = this.currentMonthWithYear + '' + record.date

			this.$http.post(API.TO_RECORD(), record).then(({ data }) =>
			{
				this.$store.commit('PUT_RECORD', data)
			})
		},
		onClickButtonOfItemAdding() {
			this.toggleRecordEditor(true)
			this.timeOfCurrentEditingRecord = ['', '']
		},
		onClickButtonOfItemEditing(record) {
			this.toggleRecordEditor(true)
			this.dateOfCurrentEditingRecord = record.date
			this.timeOfCurrentEditingRecord = [record.clockIn, record.clockOut]
		},
		/**
		 * @return '201903'
		 */
		combineMonthWithYear (year, month)
		{
			let [result, _month] = ['', Number(month)]

			if (year === undefined && month === undefined) {
				result = Number(format(Date.now(), 'yyyyLL'))
			}
			else {
				result = year + (_month >= 10 ? month.toString() : '0' + month)
			}
			return result
		},
		/**
		 * @param {Number|String} 9
		 * @return Dec
		 */
		getMonthAsEnglish(month) {
			return format(new Date(month.toString()), 'LLL')
		}
	},
	computed: {
		currentYear() {
			return parseInt(this.currentMonthWithYear.toString().slice(0, 4))
		},
		currentMonth() {
			return parseInt(this.currentMonthWithYear.toString().slice(4, 6))
		},
		showMonthAsEnglishFormat() {
			const currentMonth = this.currentMonth
			return {
				nextMonth: this.getMonthAsEnglish(currentMonth === 12 ? 1 : currentMonth + 1),
				prevMonth: this.getMonthAsEnglish(currentMonth === 1 ? 12 : currentMonth - 1)
			}
		},
		tableItems() {
			if (this.currentMonthWithYear === undefined) return []
			return this.$store.getters.getRecordsInCertainMonth(this.currentMonthWithYear)
		},
		/**
		 * @param {String} date '1990-07-15' || '1990-07'
		 * @return '1990 Jul'
		 * TODO: date not always equal to date of today
		 */
		tableTitle () {
			const _currentMonthWithYear = this.currentMonthWithYear.toString()
			const [year, month] = [_currentMonthWithYear.slice(0, 4), _currentMonthWithYear.slice(4, 6)]

			return year + ' ' + format(new Date(year + '-' + month), 'LLL')
		}
	},
	components: { RecordEditor }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header-mobile { // Hide "sort" widget when review app as mobile width
	display: none
}
</style>
