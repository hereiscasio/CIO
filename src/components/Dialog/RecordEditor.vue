<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	v-model='shouldShowDialog' persistent max-width="288px" data-app
	:style='{"display": shouldShowDialog ? "inline" : "none"}'
	@click:outside='shouldShowDialog = false' scrollable
>
	<v-form v-model="validInputField" v-if='shouldShowDialog'>
		<v-card class='card--record-editor' max-height='536'>
			<v-card-title>
				<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title class="headline primary--text">{{title}}</v-list-item-title>
					<v-list-item-subtitle
						v-if='record__.length === 2' class='text-wrap'
					>
					Try to edit time by accessing below tab: "Table"
					</v-list-item-subtitle>
				</v-list-item-content>
				</v-list-item>
			</v-card-title>
			<v-card-text class='pb-0'>
				<v-container class='py-0' ref='container'>

					<template v-for='([timeType, timeValue], index) in record__'>

						<v-row :key='timeType' v-if='record__.length > 1'>
							{{`Clock-${timeType.slice(5, timeType.length)} Time`}}
						</v-row>

						<v-row :key='index' :class='layoutRule'>
							<v-col class='pb-0'>
								<v-text-field
									label="Hr" v-model='timeValue[0]'
									class='input-field--time-editing-panel'
									:placeholder="timeValue[0]" outlined type='tel'
									v-mask='`##`' :rules="[rules.required, rules.maxHour]"
								>
								</v-text-field>
							</v-col>

							<v-col class='pb-0'>
								<v-text-field
									label="Min" v-model='timeValue[1]'
									class='input-field--time-editing-panel'
									:placeholder="timeValue[1]" outlined type='tel'
									v-mask='`##`' :rules="[rules.required, rules.maxMinute]"
								>
								</v-text-field>
							</v-col>
						</v-row>

					</template>

					<template v-if='isAddingMode'>
						<v-row>
							<v-col cols="12" class='pb-0'>
							<v-text-field
								label='day of this month' v-model='enteredDay'
								class='input-field--time-editing-panel'
								placeholder='e.g. 03' outlined type='tel'
								@change='() => {}'
								v-mask='`##`' :rules="[rules.required, checkEnteredDayIsValid]"
							>
							</v-text-field>
							</v-col>
						</v-row>

					</template>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					@click="onSaveRecordEditing" :disabled="!validInputField"
					text v-text='`SAVE`'
				/>
				<v-btn
					@click="shouldShowDialog = false"
					text v-text='`CANCEL`'
				/>
			</v-card-actions>
		</v-card>
	</v-form>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import { mask } from 'vue-the-mask';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { dbService } from '@/helper/db.service.js';
import { getDaysInMonth } from 'date-fns';
import visibleMechanism from '@/components/Dialog/visibleMechanism.js';

export default {
	extends: visibleMechanism,

	data () {
		return {
			validInputField: true,
			enteredDay: '',
			rules: {
				/**
				 * if no value provided, display the text : 'Required'
				 */
				required: value => !!value || 'Required.',
				/**
				 * if entered number > 24, display the text : 'Required'
				 */
				maxHour: value => parseInt(value, 10) < 25 || 'Max hour = 24',
				maxMinute: value => parseInt(value, 10) < 60 || 'Max minute = 59'
			},
			/**
			 * [
			 * 		['clockIn', [12, 23]],
			 * 		['clockOut', [12, 23]],
			 * 		date: 2020-02-23 || ''
			 * ]
			 */
			record__: undefined
		}
	},

	computed: {
		layoutRule () {
			return this.isAddingMode ? {
				'flex-column': false
			} : {
				'flex-column': true
			};
		},
		focusedMonthWithYear () {
			return this.$store.state.focusedMonthWithYear;
		}
	},

	created() {
		this.determineEditorMode();
		this.setTitle();
		this.showReformatedRecord();
	},

	methods: {
		checkEnteredDayIsValid (day)
		{
			if (day.length < 2) return 'please enter 2 numbers';

			const enteredDayOverMaxInMonth = Number(day) > getDaysInMonth(new Date(this.focusedMonthWithYear));
			const date = this.focusedMonthWithYear + '-' + day;

			if (enteredDayOverMaxInMonth) return 'over max day in the month';
			return true;
		},

		determineEditorMode () {
			this.isAddingMode = this.payload.record.date === '';
		},

		setTitle () {
			 this.title = this.isAddingMode ? 'Add History' : 'Edit History';
		},
		/**
		 * ⚡️ e.g.
		 * if selected date which not yet with any record on calendar
		 * in this case, both `record.clockIn` & `record.clockOut` are empty
		 */
		showReformatedRecord ()
		{
			let __record = require('lodash.omit')(this.payload.record, ['date']);
			__record = Object.entries(__record).map(([timeType, dateValue]) =>
			{
				dateValue = dateValue.split(':');
				const ifEmpty = dateValue.length === 1;
				ifEmpty && (dateValue = [,,]); // ⚡️
				return [timeType, dateValue];
			});
			__record.date = this.payload.record.date;

			this.record__ = __record;
		},

		onSaveRecordEditing ()
		{
			if (!this.validInputField) return;

			const cb = ([timeType, timeValue]) =>
			{
				timeValue[1].length === 1 && (timeValue[1] = 0 + timeValue[1]);
				timeValue[0].length === 1 && (timeValue[0] = 0 + timeValue[0]);
				return [timeType, timeValue.join(':')];
			};
			dbService.updateRecord(
			{
				date: this.getDateOfUpdatedRecord(),
				...Object.fromEntries(this.record__.map(cb))
			});
			this.shouldShowDialog = false;
		},

		getDateOfUpdatedRecord ()
		{
			if (this.isAddingMode) {
				return this.focusedMonthWithYear + '-' + this.enteredDay;
			}
			return this.record__.date;
		}
	},

	watch: {
		shouldShowDialog(value)
		{
			if (value)
			{
				this.$nextTick(() => disableBodyScroll(this.$refs.container.$el));
				return;
			}
			this.$emit('onHideDialog');
			clearAllBodyScrollLocks();
		}
	},

	directives: { mask }
}
</script>

<style lang="scss" scoped>
.input-field--time-editing-panel ::v-deep input {
	text-align: center;
}
.button--show-record-editor {
	position: absolute;
	top: -25px;
	right: -25px;
}
.v-list-item__subtitle {
	line-height: 1.5;
}

@mixin iOS-scrolling-disability-fixer {
	max-height: 290px;
}

::v-deep .card--record-editor .v-card__text .container {
	overflow-y: scroll !important;
	-webkit-overflow-scrolling: touch !important;
	@include iOS-scrolling-disability-fixer;
}
::v-deep .v-list-item__content { // just make styling feels good
	padding: 0;
}
</style>