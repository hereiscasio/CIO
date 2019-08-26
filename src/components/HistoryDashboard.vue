<template>
<!-- eslint-disable vue/no-v-html -->
<div data-cy='view--dashboard--home'>
	<Notification mode='usageTips' :content='usageTips'/>

	<v-dialog
		:value="shouldShowHistoryByDatePicker"
		fullscreen hide-overlay transition="dialog-bottom-transition"
	>
		<v-date-picker
			v-if='focusedTabTitle === "date"'
			data-testid='view--history-date'
			v-model="selectedDate"
			@click:date="onClickDateButton"
		></v-date-picker>

		<v-data-table
			v-else-if='focusedTabTitle === "table"'
			data-testid='view--history-table'
			:headers="headers"
			:items="desserts"
		>
		</v-data-table>

		<v-bottom-navigation
			v-model="focusedTabTitle" horizontal
		>
			<v-btn value="leave" @click='shouldShowHistoryByDatePicker = false'>
				Leave
				<v-icon>directions_run</v-icon>
			</v-btn>

			<v-btn value="date">
				Date
				<v-icon>date_range</v-icon>
			</v-btn>

			<v-btn value="table">
				Table
				<v-icon>view_list</v-icon>
			</v-btn>
		</v-bottom-navigation>

	</v-dialog>

	<HistoryEditor
		v-if='shouldShowHistoryEditor'
		:defaultTime='timeOfSelectedDate' mode='history'
	/>
</div>
<!--eslint-enable-->
</template>

<script>
import HistoryEditor from './HistoryEditor'
import * as CONSTANTS from './../constants'
import Notification from './Notification'
export default {
	data () {
		return {
			shouldShowHistoryEditor      : false,
			focusedTabTitle               : 'date',
			shouldShowHistoryByDatePicker: true,
			selectedDate            	  : this.$helper.getCurrent().date(),
			timeOfSelectedDate           : '',

			// FIXME: fake data
			headers: [
				{
					text: 'Dessert (100g serving)',
					align: 'left',
					sortable: false,
					value: 'name'
				},
				{ text: 'Calories', value: 'calories' },
				{ text: 'Fat (g)', value: 'fat' },
				{ text: 'Carbs (g)', value: 'carbs' },
				{ text: 'Protein (g)', value: 'protein' },
				{ text: 'Actions', value: 'action', sortable: false }
			],
			desserts: []
		}
	},
	created () {
		this.usageTips = CONSTANTS.TEXT.USAGE_TIPS
	},
	methods: {
		onClickDateButton (selectedDate) {
			this.timeOfSelectedDate = '11:15' // FIXME: hard code
			this.shouldShowHistoryEditor = true
		}
	},
	components: { Notification, HistoryEditor }
}
</script>