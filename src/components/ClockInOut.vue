<template>
<div class='px-4'>
	<Notification
		v-if='shouldShowSayHello'
		mode='greeting' :content='textToSayHello'
	/>

	<ClockWidget class='mx-n4'/>

	<v-btn
		v-if='todayRecord === undefined'
		height='52' block tile light elevation='2'
		@click='clockIn' class='font-weight-bold my-3'
	>
		<v-icon color='primary' left v-text='`timer`'/>&nbsp;CLOCK IN
	</v-btn>
	<v-btn
		v-else-if='todayRecord.clockOut === ""'
		height='52' block tile light elevation='2'

		@click='() => clockOut()' class='font-weight-bold my-3'
	>
		<v-icon color='primary' left v-text='`timer_off`'/>&nbsp;CLOCK OUT
	</v-btn>

	<StaticTimePresenter
		v-if='todayRecord && todayRecord.clockIn'
		@click-close-button='requestToDeleteClockIn'
		:time='todayRecord.clockIn' title='CLOCK-IN' :deletable='canDeleteClockIn' class='my-4'
	>
		<RecordEditor
			:timeData='[todayRecord.clockIn]'
			editTarget='clockIn'
			@finish-record-editing='requestToUpdateTodayRecord'
		/>
	</StaticTimePresenter>

	<StaticTimePresenter
		v-if='todayRecord && todayRecord.clockOut'
		:time='todayRecord.clockOut' title='CLOCK-OUT' class='my-4'
	>
		<RecordEditor
			:timeData='[todayRecord.clockOut]'
			editTarget='clockOut'
			@finish-record-editing='requestToUpdateTodayRecord'
		/>
	</StaticTimePresenter>

</div>
</template>
<script>
import Notification from './Notification'
import RecordEditor from './RecordEditor'
import StaticTimePresenter from './StaticTimePresenter'
import ClockWidget from './ClockWidget'
import { size } from 'lodash-core'
import TYPE from 'vue-types' // eslint-disable-line
import { API } from './../constants'
export default {
	computed: {
		textToSayHello () {
			// return `Hello, ${localStorage.userId}` DEPRECATED
			return 'Hello'
		},
		todayRecord () {
			return this.$store.state.todayRecord
		}
	},
	created() {
		this.sayHelloFor1stTimeUser()
		this.requestToShowTodayRecord()
			.then(this.autoFinishTodayRecordAtMidnight)
			.catch(e => {
				console.warn('Fail to get today record')
			})
	},
	data () {
		return {
			canDeleteClockIn : false,
			shouldShowSayHello : false
		}
	},
	methods: {

		autoFinishTodayRecordAtMidnight()
		{
			if (this.todayRecord === undefined) return

			const dateOfRecord = this.todayRecord.date
			const dateOfToday = () => this.$helper.getCurrent().date()

			switch(dateOfToday() - dateOfRecord)
			{
				case 1: this.$store.commit('RESET_TODAY_RECORD'); break // this is already a yesterday record
				case 0: // this is today record
					let todayRecordAutoResetter = setInterval(() =>
					{
						if (dateOfToday() - dateOfRecord === 1)
						{
							this.$store.commit('RESET_TODAY_RECORD')
							clearInterval(todayRecordAutoResetter)
							todayRecordAutoResetter = undefined
						}
					}, 3000)
					break

				default: console.warn(`UNEXPECTED RESULT: can't determine whether finish today record`); break
			}
		},
		requestToUpdateTodayRecord(editedResult)
		{
			if (editedResult === undefined) return
			if (size(editedResult) === 1) { // clock-in or clock-out
				editedResult = { ...this.todayRecord, ...editedResult }
			}
			this.$http.patch(API.RECORD_TODAY(), editedResult).then(({ data }) =>
			{
				this.$store.commit('PUT_RECORD', data)
			})
		},
		/**
		 * TODO: should test if return null
		 */
		requestToDeleteClockIn()
		{
			this.$http.delete(API.RECORD_TODAY()).then(({ data }) =>
			{
				const dateOfToday = this.$helper.getCurrent().date()
				this.$store.commit('DELETE_RECORD', { date: dateOfToday })
				this.canDeleteClockIn = false
			})
		},

		/**
		 * TODO: if he didn't terminate the app on device A when he did clock-in,
		 * and he clock-out on device B, now he want to check data on device A
		 * how can we sync data ?
		 */
		requestToShowTodayRecord()
		{
			return new Promise(resolve =>
			{
				this.$http.get(API.RECORD_TODAY()).then(({ data }) =>
				{
					if (data.clockOut === '') {
						this.canDeleteClockIn = true
					}
					else {
						this.canDeleteClockIn = false
					}
					size(data) > 0 && this.$store.commit('PUT_RECORD', data)
					resolve()
				}).catch(error => {
					console.warn(`FAIL: HTTP GET: ${error}`)
					/*
					 * TODO: json-server should return `null` if no data existed ?
					 * if (error.response.status === 404) {
					 * }
					 */
				})
			})
		},
		sayHelloFor1stTimeUser()
		{
			if (localStorage.firstTimeUse === 'true') {
				this.shouldShowSayHello = true
			}
		},
		/**
		 * @param time {String}
		 * TODO:
		 * server should handle below request data format,
		 * and should always return updated result, just like the same behavior of json-server
		 */
		clockOut (time)
		{
			const dataToServer = this.todayRecord
			dataToServer.clockOut = time || this.$helper.getCurrent().time()
			debugger
			this.$http.patch(API.RECORD_TODAY(), dataToServer).then(({ data }) =>
			{
				this.canDeleteClockIn = false
				this.$store.commit('PUT_RECORD', data)
			})
		},
		/**
		 * @param certainTime {String} '1206'
		 */
		dataForCardToPresent(certainTime) {
			return {
				time: certainTime || this.$helper.getCurrent().time(),
				date: this.$helper.getCurrent().date()
			}
		},
		clockIn () {
			const dataToServer = { date: this.$helper.getCurrent().date(), clockIn: this.$helper.getCurrent().time(), clockOut: '' }

			this.$http.post(API.TO_RECORD(), dataToServer).then(({ data }) =>
			{
				this.canDeleteClockIn = true
				this.$store.commit('PUT_RECORD', data)
				this.autoFinishTodayRecordAtMidnight()
			})
		}
	},
	components: {
		Notification, StaticTimePresenter, ClockWidget, RecordEditor
	}
}
</script>

<style lang="scss" scoped>

</style>
