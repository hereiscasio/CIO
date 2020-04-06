<template>
<Layout :didTodayClockOut='didTodayClockOut'>

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
					<use :xlink:href="getSvgPath('alarm')"></use>
				</svg>CLOCK IN
			</v-btn>
			<v-btn
				v-else-if='!didTodayClockOut'
				height='52' block tile light elevation='3'
				@click="onAddRecord('clockOut')"
				class='font-weight-bold mb-2'
			>
				<svg width='24' height='24' class='mr-2'>
					<use :xlink:href="getSvgPath('alarm-off')"></use>
				</svg>&nbsp;CLOCK OUT
			</v-btn>
			</div>
		</ClockWidget>
	</template>

	<template v-slot:clockInCard>
		<StaticTimePresenter
			class='my-4'
			v-if='didTodayClockIn'
			:time="todayRecord['clockIn']"
			:date="todayRecord['date']"
			title='Clock-In'
			@onClickEditBtn='showRecordEditorWith("clockIn")'
		/>
	</template>

	<template v-slot:clockOutCard>
		<StaticTimePresenter
			class='my-4'
			v-if='didTodayClockOut'
			:time="todayRecord['clockOut']"
			:date="todayRecord['date']"
			title='Clock-Out'
			@onClickEditBtn='showRecordEditorWith("clockOut")'
		/>
	</template>

</Layout>
</template>

<script>
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';
import StaticTimePresenter from './StaticTimePresenter.vue';
import ClockWidget from './ClockWidget/index.vue';
import Layout from './ClockInLayout.vue';
import format from 'date-fns/format';
import omit from 'lodash.omit';
import { dbService } from '@/helper/db.service.js';

export default {
	mixins: [getSvgPathMixin],

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
		showRecordEditorWith (timeType)
		{
			const dataForEditing = {
				record: {
					date: this.todayRecord.date,
					[timeType]: this.todayRecord[timeType]
				}
			};
			this.$fire('request-dialog', 'record-editor', dataForEditing);
		},

		onAddRecord (timeType)
		{
			const record =
			{
				date: format(Date.now(), 'yyyy-LL-dd'),
				[timeType]: format(Date.now(), 'kk:mm')
			};
			dbService.updateRecord(record);
		}
	},

	components: {
		StaticTimePresenter, ClockWidget, Layout
	}
}
</script>