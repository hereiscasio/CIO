<template>
<Layout :todayRecord='didTodayClockOut'>

	<template v-slot:clockWidget>
		<ClockWidget v-slot:buttons>
			<div class='mx-4 mt-5'>
			<v-btn
				v-if='!didTodayClockIn'
				height='52' block tile light elevation='3'
				@click="onAddRecord('clockIn')"
				class='font-weight-bold mb-2'
			>
				<svg width='24' height='24' class='mr-2'>
					<use xlink:href="@/assets/sprite.svg#alarm"></use>
				</svg>CLOCK IN
			</v-btn>
			<v-btn
				v-else-if='!didTodayClockOut'
				height='52' block tile light elevation='3'
				@click="onAddRecord('clockOut')"
				class='font-weight-bold mb-2'
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
			class='my-4'
			v-if='didTodayClockIn'
			dataType='clockIn' :record="todayRecord"
			v-slot:editing-button
		>
			<svg
				@click="fireEvent('clockOut')" width='18' height='18' class='icon-btn'
			>
				<use xlink:href="@/assets/sprite.svg#pencil"></use>
			</svg>
		</StaticTimePresenter>
	</template>

	<template v-slot:clockOutCard>
		<StaticTimePresenter
			class='my-4'
			v-if='didTodayClockOut'
			dataType='clockOut' :record='todayRecord'
			v-slot:editing-button
		>
			<svg
				@click="fireEvent('clockIn')" width='18' height='18' class='icon-btn'
			>
				<use xlink:href="@/assets/sprite.svg#pencil"></use>
			</svg>
		</StaticTimePresenter>
	</template>

</Layout>
</template>

<script>
import StaticTimePresenter from './StaticTimePresenter.vue';
import ClockWidget from './ClockWidget/index.vue';
import Layout from './ClockInLayout.vue';
import format from 'date-fns/format';

export default {
	computed:
	{
		didTodayClockIn()
		{
			return this.todayRecord && this.todayRecord.clockIn;
		},
		didTodayClockOut()
		{
			return this.todayRecord && this.todayRecord.clockOut;
		},
		todayRecord ()
		{
			return this.$store.state.todayRecord;
		}
	},

	methods:
	{
		onAddRecord(timeType) {
			const record =
			{
				date: format(Date.now(), 'yyyy-LL-dd'),
				[timeType]: format(Date.now(), 'kk:mm')
			};
			require('@/helper/db.service.js').default.updateRecord(record)
		},

		fireEvent (omittedDataType)
		{
			this.$fire(
				'request-dialog', 'record-editor',
				{
					record: require('lodash.omit')(this.todayRecord, [omittedDataType])
				}
			);
		}
	},

	components: {
		StaticTimePresenter, ClockWidget, Layout
	}
}
</script>
<style lang="scss" scoped>
	::v-deep .icon-btn {
		cursor: pointer;
	}
</style>