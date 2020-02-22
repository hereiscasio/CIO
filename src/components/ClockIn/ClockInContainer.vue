<template>
<Layout :todayRecord='todayRecord'>
	<template v-slot:clockWidget>
		<ClockWidget v-slot:buttons>
			<div class='mx-4 mt-5'>
			<v-btn
				v-if='todayRecord === null'
				height='52' block tile light elevation='3'
				@click='clockIn' class='font-weight-bold mb-2'
			>
				<svg width='24' height='24' class='mr-2'>
					<use xlink:href="@/assets/sprite.svg#alarm"></use>
				</svg>CLOCK IN
			</v-btn>
			<v-btn
				v-else-if='todayRecord && todayRecord.clockOut === ""'
				height='52' block tile light elevation='3'
				@click='clockOut()' class='font-weight-bold mb-2'
			>
				<svg width='24' height='24' class='mr-2'>
					<use xlink:href="@/assets/sprite.svg#alarm-off"></use>
				</svg>&nbsp;CLOCK OUT
			</v-btn>
			</div>
		</ClockWidget>
	</template>

	<template v-slot:clockInCard>
		<StaticTimePresenter
			v-if='todayRecord && todayRecord.clockIn'
			@click-close-button='deleteClockIn'
			:time='todayRecord.clockIn' title='CLOCK-IN' :deletable='canDeleteClockIn' class='my-4'
		>
			<RecordEditor
				:timeData='[todayRecord.clockIn]'
				editTarget='clockIn'
				@finish-record-editing='updateTodayRecord'
			/>
		</StaticTimePresenter>
	</template>

	<template v-slot:clockOutCard>
		<StaticTimePresenter
			v-if='todayRecord && todayRecord.clockOut'
			:time='todayRecord.clockOut' title='CLOCK-OUT' class='my-4'
		>
			<RecordEditor
				:timeData='[todayRecord.clockOut]'
				editTarget='clockOut'
				@finish-record-editing='updateTodayRecord'
			/>
		</StaticTimePresenter>
	</template>
</Layout>
</template>

<script>
import RecordEditor from './../RecordEditor.vue'
import StaticTimePresenter from './StaticTimePresenter.vue'
import ClockWidget from './ClockWidget.vue'
import Layout from './ClockInLayout.vue'

export default {
	data () {
		return {
			canDeleteClockIn: false,
			todayRecord: null,
			virtualSpaceBetweenCards: 0
		}
	},
	computed: {
		maxWidthOfCards() {
			let didClockOut = this.todayRecord && this.todayRecord.clockOut

			return this.$vuetify.breakpoint.smAndUp ?
				(didClockOut ? '593px' : '516px') : '100%'
		}
	},
	watch: {
		maxWidthOfCards (value) {
			this.virtualSpaceBetweenCards = value === '593px' ? 16 : 0
		},
		todayRecord (value)
		{
			console.warn('todayRecord change: ', value)
			if (value === null || value.clockOut !== '')
			{
				this.canDeleteClockIn = false
				return
			}
			this.canDeleteClockIn = true // value.clockOut === ''
		}
	},
	created() {
		this.syncTodayRecordWithRTDB()
	},
	beforeDestroy () {
		this.removeTodayRecordAutoResetter()
	},
	methods: {
		syncTodayRecordWithRTDB ()
		{
			this.detectedDataRefInDB = this.getTodayRecordRefInDB()

			this.detectedDataRefInDB.on('value', record =>
			{
				console.warn('TODAY RECORD: ', record.val())

				if (record.exists()) {
					this.autoFinishTodayRecordAtMidnight()
				}
				this.todayRecord = record.val()
			})
		},
		autoFinishTodayRecordAtMidnight()
		{
			if (this.todayRecord === null) return

			const dateOfRecord = this.todayRecord.date
			const dateOfToday = () => this.$helper.getCurrent().date()

			this.todayRecordAutoResetter = setInterval(() =>
			{
				if (dateOfToday() - dateOfRecord === 1) // this is already a yesterday record
				{
					this.detectedDataRefInDB.off()
					this.syncTodayRecordWithRTDB()
					this.removeTodayRecordAutoResetter()
				}
			}, 3000)
		},
		removeTodayRecordAutoResetter()
		{
			if (this.todayRecordAutoResetter !== undefined)
			{
				clearInterval(this.todayRecordAutoResetter)
				this.todayRecordAutoResetter = undefined
			}
		},
		updateTodayRecord(editedResult)
		{
			if (editedResult === undefined) return
			this.getTodayRecordRefInDB().update({ ...this.todayRecord, ...editedResult })
		},
		deleteClockIn()
		{
			this.getTodayRecordRefInDB().remove()
		},
		clockOut ()
		{
			const clockOut = this.$helper.getCurrent().time()
			this.getTodayRecordRefInDB().update({ clockOut })
		},
		async clockIn () {
			const dataToServer = {
				date: this.$helper.getCurrent().date(),
				clockIn: this.$helper.getCurrent().time(),
				clockOut: ''
			}
			await this.getTodayRecordRefInDB().update(dataToServer)
			this.autoFinishTodayRecordAtMidnight()
		},
		getTodayRecordRefInDB ()
		{
			const dateOfToday = this.$helper.getCurrent().date()
			const dateWithoutDay = Number(dateOfToday.toString().slice(0, 6))
			const dataPath = `${this.$root.uid}/${dateWithoutDay}/${dateOfToday}`

			return this.$db.ref(dataPath)
		}
	},
	components: {
		StaticTimePresenter, ClockWidget, RecordEditor, Layout
	}
}
</script>