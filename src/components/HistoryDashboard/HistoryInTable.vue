<template>
<!-- eslint-disable vue/no-v-html -->
<div id='wrapper--table-to-show-history'>
	<v-data-table
		id='record-table'
		:headers="tableHeaders"
		:items="recordsInFocusedMonth"
		:page.sync="currentFocusedPage"
		:items-per-page="MAX_MONTH"
		hide-default-footer
		:custom-sort='sortRecordByDate'
		@page-count="numberOfPages = $event"
	>
		<template v-slot:top>
			<v-toolbar flat color="white">
			<v-toolbar-title class='headline font-weight-black'>{{tableTitle}}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				@click='$emit("onClickRecordAdding")' color='primary'
			>
				<svg width='24' height='24'>
					<use :xlink:href="getSvgPath('plus')"></use>
				</svg>
				History
			</v-btn>
			</v-toolbar>
		</template>

		<template v-slot:item.action="{ item }">
			<svg
				width='18' height='18' class='icon-btn--edit'
				@click='$emit("onClickRecordEditing", item.date)'
			>
				<use :xlink:href="getSvgPath('pencil')"></use>
			</svg>
		</template>

		<template v-slot:item.date="{ item }">{{getDayFromDate(item.date)}}</template>
	</v-data-table>

	<v-footer
		absolute color='transparent'
	>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickMonthSwitchingButton(-1)'>
			<svg width='36' height='36'>
				<use :xlink:href="getSvgPath('chevron-left')"></use>
			</svg>
		</v-btn>
		<v-subheader>{{showMonthInEnglishFormat.prevMonth}}</v-subheader>

		<v-spacer></v-spacer>

		<v-subheader>{{showMonthInEnglishFormat.nextMonth}}</v-subheader>
		<v-btn class="px-0" min-width='36' color='white' @click='onClickMonthSwitchingButton(1)'>
			<svg width='36' height='36'>
				<use :xlink:href="getSvgPath('chevron-right')"></use>
			</svg>
		</v-btn>
	</v-footer>
</div>
<!--eslint-enable-->
</template>

<script>
import { parse, format, addMonths } from 'date-fns';
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';

export default {
	mixins: [getSvgPathMixin],
	props: ['focusedMonthWithYear', 'recordsInFocusedMonth'],

	data () {
		this.MAX_MONTH = 31;
		return {
			numberOfPages: 0,
			currentFocusedPage: 1
		}
	},

	computed: {
		/**
		 * @return '1990 Jul'
		 */
		tableTitle ()
		{
			return format(
				new Date(this.focusedMonthWithYear), 'yyyy LLL'
			);
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
		getDayFromDate (date) {
			return date.slice(8, 11);
		},

		sortRecordByDate(items)
		{
			const ascendingSorter = (a, b) => Number(a.date.slice(8, 10)) - Number(b.date.slice(8, 10));
			return items.sort(ascendingSorter);
		},

		onClickMonthSwitchingButton(direction)
		{
			const fromDate = parse(this.focusedMonthWithYear, 'yyyy-LL', new Date());
			const toDate = format(addMonths(fromDate, direction), 'yyyy-LL');
			this.$emit('onSwitchMonthButton', toDate);
			this.currentFocusedPage += direction;
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

@mixin iOS-scrolling-bug-fixer {
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
}

#wrapper--table-to-show-history {
	height: 100vh;
	@include iOS-scrolling-bug-fixer;
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

.v-footer {
	margin-bottom: 64px;
}

</style>
