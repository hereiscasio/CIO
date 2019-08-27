<template>
<!-- eslint-disable vue/no-v-html -->
<div>
	<v-data-table
		data-testid='view--history-table'
		:headers="headers"
		:items="historyData"
		:page.sync="currentFocusedPage"
		:items-per-page="1"
		hide-default-footer
		@page-count="numberOfPages = $event"
	>
	<template v-slot:top>
		<v-toolbar flat color="white">
		<v-toolbar-title>Title</v-toolbar-title>
		<v-spacer></v-spacer>

		<v-btn>
			<v-icon left>add</v-icon> History
		</v-btn>
		</v-toolbar>
	</template>

	<template v-slot:item.action="{ item }">
		<v-icon
		small @click="editItem(item)" v-text='`edit`'
		/>
	</template>

	</v-data-table>

	<v-footer absolute style='margin-bottom: 64px' color='transparent'>
		<v-btn class="px-0" min-width='36' color='white' @click='currentFocusedPage = currentFocusedPage - 1'>
			<v-icon dark>keyboard_arrow_left</v-icon>
		</v-btn>
		<v-subheader>March</v-subheader>
		<v-spacer></v-spacer>
		<v-subheader>May</v-subheader>
		<v-btn class="px-0" min-width='36' color='white' @click='currentFocusedPage = currentFocusedPage + 1'>
			<v-icon dark>keyboard_arrow_right</v-icon>
		</v-btn>
	</v-footer>
</div>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line
export default {
	data () {
		return {
			currentFocusedPage: 1,
			numberOfPages: 0, // init
			dialog: false,
			headers: [
				{
					text: 'Date',
					align: 'left',
					value: 'date'
				},
				{ text: 'Clock-in', value: 'clockIn' },
				{ text: 'Clock-out', value: 'clockOut' },
				{ text: 'Action', value: 'action' }
			]
		}
	},
	created () {
		this.initialize()
	},
	methods: {
		initialize () {
			this.historyData = [
				{
					date: 3,
					clockIn: '08:11',
					clockOut: '18:43'
				},
				{
					date: 5,
					clockIn: '09:00',
					clockOut: '18:43'
				},
				{
					date: 5,
					clockIn: '09:00',
					clockOut: '18:23'
				}
			]
		}
	}
}
</script>

<style lang='scss' scoped>

</style>