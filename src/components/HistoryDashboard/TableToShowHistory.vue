<template>
<!-- eslint-disable vue/no-v-html -->
<div id='wrapper--table-to-show-history'>
	<v-data-table
		id='record-table'
		:headers="tableHeaders"
		:items="tableItems"
		:page.sync="currentFocusedPage"
		:items-per-page="30"
		hide-default-footer

		:custom-sort='sortRecordByDate'
		@page-count="numberOfPages = $event"
	>
		<template v-slot:top>
			<v-toolbar flat color="white">
			<v-toolbar-title class='headline font-weight-black'>{{tableTitle}}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				@click='onClickAddingButton' color='primary'
			>
				<svg width='24' height='24'>
					<use xlink:href="@/assets/sprite.svg#plus"></use>
				</svg>
				History
			</v-btn>
			</v-toolbar>
		</template>

		<template v-slot:item.action="{ item }">
			<svg
				width='18' height='18' class='icon-btn--edit'
				@click='$emit("onClickEditingButton", item.date)'
			>
				<use xlink:href="@/assets/sprite.svg#pencil"></use>
			</svg>
		</template>

		<template v-slot:item.date="{ item }">{{item.date.slice(8, 11)}}</template>
	</v-data-table>

	<v-footer
		absolute style='margin-bottom: 64px' color='transparent'
	>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickMonthSwitchingButton(-1)'>
			<svg width='36' height='36'>
				<use xlink:href="@/assets/sprite.svg#chevron-left"></use>
			</svg>
		</v-btn>
		<v-subheader>{{showMonthInEnglishFormat.prevMonth}}</v-subheader>

		<v-spacer></v-spacer>

		<v-subheader>{{showMonthInEnglishFormat.nextMonth}}</v-subheader>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickMonthSwitchingButton(1)'>
			<svg width='36' height='36'>
				<use xlink:href="@/assets/sprite.svg#chevron-right"></use>
			</svg>
		</v-btn>
	</v-footer>
</div>
<!--eslint-enable-->
</template>

<script>
import { parse, format, getDaysInMonth, addMonths } from 'date-fns';


export default {
	props: ['focusedMonthWithYear'],

	data () {
		return {
			numberOfPages: 0,
			currentFocusedPage: 1
		}
	},

	computed: {
		tableItems() {
			const records = this.$store.state.recordsInFocusedMonth;
			return records === null ? [] : require('lodash.toarray')(records);
		},
		/**
		 * @return '1990 Jul'
		 */
		tableTitle () {
			const year = this.focusedMonthWithYear.slice(0, 4);
			const month = format(new Date(this.focusedMonthWithYear), 'LLL');

			return year + ' ' + month;
		},

		showMonthInEnglishFormat()
		{
			const date = new Date(this.focusedMonthWithYear);
			const nextMonth = format(addMonths(date, 1), 'LLL');
			const prevMonth = format(addMonths(date, -1), 'LLL');

			return { nextMonth, prevMonth }
		}
	},

	created() {
		this.tableHeaders = [
			{ text: 'Date', align: 'left', value: 'date' },
			{ text: 'Clock-in', value: 'clockIn' },
			{ text: 'Clock-out', value: 'clockOut' },
			{ text: 'Action', value: 'action' }
		];
	},

	methods: {
		onClickAddingButton() {
			this.checkEnteredDayIsValid.focusedMonthWithYear = this.focusedMonthWithYear;
			this.$emit("onClickAddingButton", this.checkEnteredDayIsValid);
		},

		sortRecordByDate(items) {
			return items.sort((a, b) => Number(a.date.slice(8, 10)) - Number(b.date.slice(8, 10)));
		},

		checkEnteredDayIsValid(day)
		{
			if (day.length < 2) return 'please enter 2 numbers';

			const enteredDayOverMaxInMonth = Number(day) > getDaysInMonth(new Date(this.focusedMonthWithYear));
			const date = this.focusedMonthWithYear + '-' + day;

			if (enteredDayOverMaxInMonth) return 'over max day in the month';
			return true;
		},

		onClickMonthSwitchingButton(btnDirection)
		{
			const dateStr = parse(this.focusedMonthWithYear, 'yyyy-LL', new Date());
			this.$emit('onSwitchMonthButton', format(addMonths(dateStr, btnDirection), 'yyyy-LL'));
			this.currentFocusedPage = this.currentFocusedPage + btnDirection;
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header-mobile { // Hide "sort" widget when review app as mobile width
	display: none
}
#record-table {
	overflow-y: scroll;
	height: 100%;
	padding-bottom: 128px;
}
#wrapper--table-to-show-history {
	height: 100%;
}
::v-deep .v-data-table__mobile-row__header {
    font-weight: normal;
}
.icon-btn--edit {
	opacity: .5;
	margin: 0 auto;
	display: block;
	cursor: pointer;
}


</style>
