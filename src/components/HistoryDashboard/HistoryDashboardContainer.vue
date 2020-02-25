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
			v-if='focusedTabTitle === "Calendar"'
			:events='allDatesInFocusedMonth'
			@onClickDateButton='fireEvent'
		/>
		<TableToShowHistory v-else-if='focusedTabTitle === "Table"'/>
	</v-sheet>

	<v-bottom-navigation
		v-model="focusedTabTitle" horizontal absolute class='elevation-24' color='#3D5AFE'
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

export default {
	data () {
		return {
			focusedTabTitle: 'Calendar'
		}
	},

	methods: {
		fireEvent(date) {
			const record = this.$store.state.recordsInFocusedMonth[date];
			const payload = record ? record : {date, clockIn: '', clockOut: ''};
			this.$fire('request-dialog', {componentId: 'record-editor', payload});
		}
	},

	computed: {
		allDatesInFocusedMonth()
		{
			if (this.$store.state.recordsInFocusedMonth)
			{
				return Object.keys(this.$store.state.recordsInFocusedMonth);
			}
			return [];
		},
	},

	created() {
		this.buttonInfoOfBottomNavigator =
		[
			{ name:'Leave', icon: 'run' },
			{ name:'Calendar', icon: 'calendar-range' },
			{ name:'Table', icon: 'view-list' }
		];
	},

	mounted() {
		this.$fire('request-dialog', {componentId: 'notification'});
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