<template>
<!-- eslint-disable vue/no-v-html -->
<div id='wrapper--table-to-show-history'>
	<v-data-table
		id='record-table'
		data-testid='view--history-table'
		:headers="tableHeaders"
		:items="tableItems"
		:page.sync="currentFocusedPage"
		:items-per-page="30"
		hide-default-footer
		sort-by="date"
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

		<template v-slot:item.date="{ item }">
			{{item.date.toString().slice(6, 8)}}
		</template>
	</v-data-table>

	<v-footer
		absolute style='margin-bottom: 64px' color='transparent'
	>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickButtonOfPrevMonth'>
			<v-icon dark>keyboard_arrow_left</v-icon>
		</v-btn>

		<v-subheader>{{showMonthInEnglishFormat.prevMonth}}</v-subheader>
		<v-spacer></v-spacer>
		<v-subheader>{{showMonthInEnglishFormat.nextMonth}}</v-subheader>

		<v-btn class="px-0" min-width='36' color='white' @click='onClickButtonOfNextMonth'>
			<v-icon dark>keyboard_arrow_right</v-icon>
		</v-btn>
	</v-footer>

	<RecordEditor
		v-if='shouldShowRecordEditor'
		:timeData='timeOfCurrentEditingRecord'
		:dayValidator='checkEnteredDayIsValid'
		@finish-record-editing='updateRecord'
		@finish-record-adding='addNewRecord'
		@cancel-record-editing='shouldShowRecordEditor = false'
		editTarget='clockInOut' no-built-in-trigger
		usedWithTable
	/>
</div>
<!--eslint-enable-->
</template>

<script>
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'
import RecordEditor from './../RecordEditor.vue'


export default {
	data () {
		return {
			// TODO: should have dynamic itemPerPage for adjusting by according to certain month
			tableItems: [],
			currentFocusedPage: 1,
			numberOfPages: 0, // init
			monthWithYearInCurrentView: this.combineMonthWithYear(),
			timeOfCurrentEditingRecord: ['', ''],
			shouldShowRecordEditor: false,
			dateOfCurrentEditingRecord: ''
		}
	},
	created() {
		this.tableHeaders = [
			{ text: 'Date', align: 'left', value: 'date' },
			{ text: 'Clock-in', value: 'clockIn' },
			{ text: 'Clock-out', value: 'clockOut' },
			{ text: 'Action', value: 'action' }
		]
		this.populateTableItems()
	},
	methods: {
		checkEnteredDayIsValid(day)
		{
			if (day.length < 2) return 'please enter 2 numbers'

			const yearWithMonth = new Date(this.yearInCurrentView, this.monthInCurrentView)
			const enteredDayOverMaxInMonth = Number(day) > getDaysInMonth(yearWithMonth)
			const date = Number(this.monthWithYearInCurrentView + day)

			if (enteredDayOverMaxInMonth) return 'over max day in the month'
			if (require('lodash.find')(this.tableItems, { date })) return 'record already existed in this day'
			return true
		},
		populateTableItems()
		{
			if (this.detectingDataRefInDB !== undefined) // reset
			{
				this.detectingDataRefInDB.off()
				this.detectingDataRefInDB = undefined
				this.tableItems = []
			}
			this.detectingDataRefInDB = this.dataRefInDB()

			this.detectingDataRefInDB.on('child_added', snapshot =>
			{
				console.warn('child_added: ', snapshot.val())
				this.tableItems.push(snapshot.val())
			})
			this.detectingDataRefInDB.on('child_changed', snapshot =>
			{
				const outDatedItem = this.tableItems.find(item => item.date === snapshot.val().date)
				outDatedItem.clockIn = snapshot.val().clockIn
				outDatedItem.clockOut = snapshot.val().clockOut
			})
		},

		dataRefInDB (dateWithoutDay)
		{
			return this.$db.ref(
				this.$root.uid + '/' + (dateWithoutDay || this.monthWithYearInCurrentView)
			)
		},

		updateRecord (editedResult)
		{
			const dateWithoutDay = this.dateOfCurrentEditingRecord.toString().slice(0, 6)

			this.shouldShowRecordEditor = false

			editedResult.date = Number(this.dateOfCurrentEditingRecord)

			this.dataRefInDB(dateWithoutDay).update({ [editedResult.date]: editedResult })

			this.dateOfCurrentEditingRecord = ''
		},

		addNewRecord(record)
		{
			this.shouldShowRecordEditor = false

			record.date = Number(this.monthWithYearInCurrentView + '' + record.date)

			this.dataRefInDB().update({ [record.date]: record })
		},

		onClickButtonOfPrevMonth()
		{
			let yearInCurrentView = this.monthInCurrentView === 1 ? this.yearInCurrentView - 1 : this.yearInCurrentView
			let monthInCurrentView = this.monthInCurrentView === 1 ? 12 : this.monthInCurrentView - 1
			const monthWithYear = this.combineMonthWithYear(yearInCurrentView, monthInCurrentView)
			this.monthWithYearInCurrentView = monthWithYear
			this.currentFocusedPage = this.currentFocusedPage - 1

			this.populateTableItems()
		},

		onClickButtonOfNextMonth()
		{
			let yearInCurrentView = this.monthInCurrentView === 12 ? this.yearInCurrentView + 1 : this.yearInCurrentView
			let monthInCurrentView = this.monthInCurrentView === 12 ? 1 : this.monthInCurrentView + 1
			const monthWithYear = this.combineMonthWithYear(yearInCurrentView, monthInCurrentView)
			this.monthWithYearInCurrentView = monthWithYear
			this.currentFocusedPage = this.currentFocusedPage + 1

			this.populateTableItems()
		},

		onClickButtonOfItemAdding() {
			this.shouldShowRecordEditor = true
			this.timeOfCurrentEditingRecord = ['', '']
		},

		onClickButtonOfItemEditing(record) {
			this.shouldShowRecordEditor = true
			this.dateOfCurrentEditingRecord = record.date
			this.timeOfCurrentEditingRecord = [record.clockIn, record.clockOut]
		},

		/**
		 * @return '201903'
		 */
		combineMonthWithYear (year, month)
		{
			let [result, _month] = ['', Number(month)]

			if (year === undefined && month === undefined)
			{
				result = format(Date.now(), 'yyyyLL')
			}
			else {
				result = year + (_month >= 10 ? month.toString() : '0' + month)
			}
			return result
		}
	},
	computed: {
		yearInCurrentView() {
			return parseInt(this.monthWithYearInCurrentView.toString().slice(0, 4))
		},
		monthInCurrentView() {
			return parseInt(this.monthWithYearInCurrentView.toString().slice(4, 6))
		},
		/**
		 * for `getMonthAsEnglish`:
		 * @param {Number|String} 9
		 * @return Dec
		 */
		showMonthInEnglishFormat()
		{
			const monthInCurrentView = Number(this.monthInCurrentView)
			const yearInCurrentView = Number(this.yearInCurrentView)
			const date = new Date(yearInCurrentView, monthInCurrentView - 1, 1)
			const nextMonth = format(addMonths(date, 1), 'LLL')
			const prevMonth = format(subMonths(date, 1), 'LLL')

			return { nextMonth, prevMonth }
		},
		/**
		 * @param {String} date '1990-07-15' || '1990-07'
		 * @return '1990 Jul'
		 */
		tableTitle () {
			const _monthWithYearInCurrentView = this.monthWithYearInCurrentView.toString()
			const year = _monthWithYearInCurrentView.slice(0, 4)
			const month = _monthWithYearInCurrentView.slice(4, 6)

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
#record-table {
	overflow-y: scroll;
	height: 100%;
	padding-bottom: 128px;
}
#wrapper--table-to-show-history {
	height: 100%;
}
::v-deep .v-data-table__mobile-row__header {
    font-weight: normal;
}
</style>
