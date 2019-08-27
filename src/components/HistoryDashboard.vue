<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	data-cy='view--dashboard--home'
	data-testid='dialog-wrapper--history-dashboard'
	:value="true" persistent
	fullscreen transition="dialog-bottom-transition"
>
	<!--
		Style Bug :
		Can not place Notification at horizontal center inside v-dialog
		The workaround is moving Notification out of v-dialog,
		but it will cause other bug
	-->
	<Notification mode='usageTips' :content='usageTips'/>

	<HistoryEditor
		v-if='shouldShowHistoryEditor' :timeData='timeOfSelectedDate'
	/>
	<!-- TODO: use vue-router to switch view -->
	<v-date-picker
		full-width
		v-if='focusedTabTitle === "calendar"'
		data-testid='view--history-calendar'
		v-model="selectedDate"
		@click:date="onClickDateButton"
		color='#3D5AFE'
	></v-date-picker>

	<TableToShowHistory v-else-if='focusedTabTitle === "table"'/>

	<v-bottom-navigation
		v-model="focusedTabTitle"
		horizontal absolute class='elevation-24' color='#3D5AFE'
	>
		<v-btn value="leave">
			Leave
			<v-icon>directions_run</v-icon>
		</v-btn>

		<v-btn value="calendar">
			Calendar
			<v-icon>date_range</v-icon>
		</v-btn>

		<v-btn value="table">
			Table
			<v-icon>view_list</v-icon>
		</v-btn>
	</v-bottom-navigation>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import HistoryEditor from './HistoryEditor'
import TableToShowHistory from './TableToShowHistory'
import * as CONSTANTS from './../constants'
import Notification from './Notification'
export default {
	data () {
		return {
			shouldShowHistoryEditor      : false,
			focusedTabTitle               : 'calendar',
			selectedDate            	  : this.$helper.getCurrent().date(),
			timeOfSelectedDate           : ['']
		}
	},
	created () {
		this.usageTips = CONSTANTS.TEXT.USAGE_TIPS
	},
	methods: {
		onClickDateButton (selectedDate) {
			this.timeOfSelectedDate = ['11:15', ''] // FIXME: hard code
			this.shouldShowHistoryEditor = true
		}
	},
	components: { Notification, HistoryEditor, TableToShowHistory }
}
</script>