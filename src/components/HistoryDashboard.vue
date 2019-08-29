<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	data-cy='view--dashboard--home'
	:value="true" persistent scrollable
	fullscreen transition="dialog-bottom-transition"
>
	<v-card>
	<!--
		Style Bug :
		Can not place Notification at horizontal center inside v-dialog
		The workaround is moving Notification out of v-dialog,
		but it will cause other bug
	-->
	<Notification
		v-if='shouldShowUsageTips'
		mode='usageTips' :content='usageTips'
		@on-click-closing-button='turnOffUsageTipsForever'
	/>
	<v-card-text class='pa-0'>
	<CalendarToShowHistory v-if='focusedTabTitle === "calendar"'/>
	<TableToShowHistory v-else-if='focusedTabTitle === "table"'/>
	</v-card-text>
	<v-card-actions>
	<v-bottom-navigation
		v-model="focusedTabTitle"
		horizontal fixed class='elevation-24' color='#3D5AFE'
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
	</v-card-actions>
	</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import CalendarToShowHistory from './CalendarToShowHistory'
import TableToShowHistory from './TableToShowHistory'
import Notification from './Notification'
import TYPE from 'vue-types' // eslint-disable-line
import { TEXT } from './../constants'
export default {
	data () {
		return {
			focusedTabTitle: 'calendar'
		}
	},
	created () {
		this.usageTips = TEXT.USAGE_TIPS

		this.shouldShowUsageTips = localStorage.doNotShowUsageTipsAgain === undefined
		this.buttonInfoOfBottomNavigator = [
			{ name:'Leave', icon: 'directions_run' },
			{ name:'Calendar', icon: 'date_range' },
			{ name:'Table', icon: 'view_list' }
		]
	},
	methods: {
		turnOffUsageTipsForever() {
			debugger
			localStorage.setItem('doNotShowUsageTipsAgain', true)
		},
		onSwitchTab (tabName) {
			if (tabName === 'Leave') this.$router.go(-1)
		}
	},
	components: { Notification, TableToShowHistory, CalendarToShowHistory }
}
</script>