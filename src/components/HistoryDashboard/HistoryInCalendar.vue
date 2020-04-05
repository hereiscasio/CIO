<template>
<!-- eslint-disable vue/no-v-html -->
<v-date-picker
	v-model="selectedDate"
	@click:date="onClickDateButton"
	color='#3D5AFE'
	full-width
	:show-current='dateOfTodayIndicator'
	:events='events'
	event-color="green lighten-1"
	ref='datePicker'
></v-date-picker>
<!--eslint-enable-->
</template>

<script>
import { addMonths, parse, format } from 'date-fns';

export default {
	props: ['events', 'focusedMonthWithYear'],

	data () {
		return {
			selectedDate: ''
		}
	},

	created() {
		this.initializeDataIntoCalendar();
	},

	mounted() {
		this.detectMonthSwitching(this.onSwitchMonthHandler);
	},

	methods: {
		onClickDateButton (selectedDate) {
			this.$emit('onClickDateButton', selectedDate);
		},

		initializeDataIntoCalendar ()
		{
			this.dateOfTodayIndicator = format(Date.now(), 'yyyy-LL-dd');
			this.selectedDate = this.dateOfTodayIndicator;
		},

		onSwitchMonthHandler (switchingDirection)
		{
			const fromDate = parse(this.focusedMonthWithYear, 'yyyy-LL', new Date());
			const toDate = format(addMonths(fromDate, switchingDirection), 'yyyy-LL');

			this.$emit('onSwitchMonthButton', toDate);
		},

		detectMonthSwitching (cb)
		{
			const {$nextBtn, $prevBtn} = this.getMonthSwitchingBtn();
			$nextBtn.addEventListener('click', cb.bind(this, 1));
			$prevBtn.addEventListener('click', cb.bind(this, -1));
		},

		getMonthSwitchingBtn ()
		{
			const monthSwitcherElementClass = '.v-date-picker-header .v-btn';
			const $buttons = this.$refs.datePicker.$el.querySelectorAll(monthSwitcherElementClass);
			return {
				$nextBtn: $buttons[1],
				$prevBtn: $buttons[0]
			};
		}
	}
}
</script>

<style lang='scss' scoped>
.v-picker--date {
	height: 100%;
	border-radius: 0 !important;
}
</style>