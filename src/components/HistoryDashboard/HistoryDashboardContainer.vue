<template>
<!-- eslint-disable vue/no-v-html -->
<div>
<v-dialog
	:value="true" persistent scrollable
	transition="dialog-bottom-transition"
	content-class='wrapper--history-dashboard'
>
	<v-card tile>

	<v-sheet height='100%' class='overflow-y-hidden' tile>
		<CalendarToShowHistory
			v-if='focusedTabTitle === "Calendar"' :events='allRecordDatesInFocusedMonth'
			@onClickDateButton='requestRecordOfTheDate'
			@onSwitchMonthButton='fetchAllRecordDatesInFocusedMonth'
		/>
		<TableToShowHistory
			v-else-if='focusedTabTitle === "Table"' :focusedMonthWithYear='focusedMonthWithYear'
			@onClickAddingButton='requestAddNewRecord'
			@onClickEditingButton='requestRecordOfTheDate'
			@onSwitchMonthButton='fetchAllRecordDatesInFocusedMonth'
		/>
	</v-sheet>

	<v-bottom-navigation
		v-model="focusedTabTitle" horizontal absolute class='elevation-24' color='#3D5AFE'
		@change='onSwitchTab'
	>
		<v-btn
			v-for='btn in buttonInfoOfBottomNavigator' :key='btn.name'
			:value="btn.name"
			@click='btn.name === "Leave" && $router.go(-1)'
		>
			{{btn.name}}
			<svg width='24' height='24' class='mr-1 ml-n1'>
				<use :xlink:href="require('@/assets/sprite.svg') + '#' + btn.icon"></use>
			</svg>
		</v-btn>
	</v-bottom-navigation>

	</v-card>
</v-dialog>
</div>
<!--eslint-enable-->
</template>

<script>
import CalendarToShowHistory from './CalendarToShowHistory.vue'
import TableToShowHistory from './TableToShowHistory.vue'
import { getLoggedUser } from '@/plugins/firebase';
import dbService from '@/helper/db.service.js';

export default {
	data () {
		return {
			focusedTabTitle: 'Calendar',
			focusedMonthWithYear: undefined
		}
	},

	computed: {
		allRecordDatesInFocusedMonth()
		{
			const records = this.$store.state.recordsInFocusedMonth;
			return records === undefined ? [] : Object.keys(records);
		}
	},

	methods: {
		onSwitchTab(tabName)
		{
			if (tabName === 'Calendar')
			{
				this.fetchAllRecordDatesInFocusedMonth();
			}
		},

		requestAddNewRecord(dayValidator)
		{
			const payload = {
				dayValidator, record: {date: '', clockIn: '', clockOut: ''}
			};
			this.$fire('request-dialog', 'record-editor', payload);
		},

		requestRecordOfTheDate(date)
		{
			const record = {
				...{date, clockIn: '', clockOut: ''},
				...this.$store.state.recordsInFocusedMonth[date]
			};
			this.$fire('request-dialog', 'record-editor', {record});
		},

		/**
		 * example of `TargetURL` :
		 * https://ciosystem.firebaseio.com/+886966001596/2020-02/2020-02-13.json?shallow=true
		 */
		async fetchAllRecordDatesInFocusedMonth(monthWithYear)
		{
			const format = require('date-fns/format');
			this.focusedMonthWithYear = monthWithYear ? monthWithYear : format(Date.now(), 'yyyy-LL');
			this.$fire('request-dialog', 'loading', true);
			await dbService.trackRecordsInFocusedMonth(monthWithYear);
			this.$fire('request-dialog', 'loading', false);
		}
	},

	created() {
		this.fetchAllRecordDatesInFocusedMonth();
		this.buttonInfoOfBottomNavigator =
		[
			{ name:'Leave', icon: 'run' },
			{ name:'Calendar', icon: 'calendar-range' },
			{ name:'Table', icon: 'view-list' }
		];
	},

	components: { TableToShowHistory, CalendarToShowHistory }
}
</script>

<style lang="scss" scoped>
::v-deep .wrapper--history-dashboard {
	width: 100%;
	height: 100%;
	margin: 0;
	border-radius: 0;
}
::v-deep .v-dialog:not(.v-dialog--fullscreen) { // modify Vuetify default styling
    max-height: 100%;
}
@media (min-width: 563px) {
	::v-deep .wrapper--history-dashboard {
		height: 80%;
		max-width: 320px;
	}
	::v-deep .v-dialog:not(.v-dialog--fullscreen) {
		max-height: 568px;
	}
}
</style>