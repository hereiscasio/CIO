<template>
<!-- eslint-disable vue/no-v-html -->
<div>
<Notification mode='tip'/>
<v-dialog
	data-cy='view--dashboard--home'
	:value="true" persistent scrollable
	transition="dialog-bottom-transition"
	content-class='wrapper--history-dashboard'
>
	<v-card tile>

	<v-sheet height='100%' class='overflow-y-hidden' tile>
		<CalendarToShowHistory v-if='focusedTabTitle === "calendar"'/>
		<TableToShowHistory v-else-if='focusedTabTitle === "table"'/>
	</v-sheet>
	<v-bottom-navigation
		v-model="focusedTabTitle"
		horizontal abs	olute class='elevation-24' color='#3D5AFE'
	>
		<v-btn
			v-for='btn in buttonInfoOfBottomNavigator' :key='btn.name'
			:value="btn.name.toLowerCase()"
			@click='onSwitchTab(btn.name)'
		>
			{{btn.name}}
			<v-icon v-text='btn.icon'/>
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
import Notification from './../Notification.vue'

export default {
	data () {
		return {
			focusedTabTitle: 'calendar'
		}
	},
	created () {
		/**
		 * TODO: enable user move bracket to next line in ESLint
		 */
		this.buttonInfoOfBottomNavigator = [
			{ name:'Leave', icon: 'directions_run' },
			{ name:'Calendar', icon: 'date_range' },
			{ name:'Table', icon: 'view_list' }
		]
	},
	methods: {
		onSwitchTab (tabName) {
			if (tabName === 'Leave') this.$router.go(-1)
		}
	},
	components: { Notification, TableToShowHistory, CalendarToShowHistory }
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