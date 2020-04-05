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

					<template v-if='dayValidator'>
						<v-row>
							<v-col cols="12" class='pb-0'>
							<v-text-field
								label='day of this month' v-model='record__.date'
								class='input-field--time-editing-panel'
								placeholder='e.g. 03' outlined type='tel'
								@change='() => {}'
								v-mask='`##`' :rules="[rules.required, dayValidator]"
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
import dbService from '@/helper/db.service.js';

export default {
	props: ['payload'],

	computed: {
		layoutRule () {
			return this.record__.length > 1 ? {
				'flex-column': false
			} : {
				'flex-column': true
			};
		}
	},

	data () {
		return {
			shouldShowDialog: false,
			title: 'Edit History',
			validInputField: true,
			dayValidator: undefined,

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
			 * 		date: 20200223
			 * ]
			 */
			record__: undefined
		}
	},

	created() {
		const {record, dayValidator} = this.payload;

		record.date === '' && (this.title = 'Add History');

		this.dayValidator = dayValidator;
		this.showReformatedRecord(record);
		this.shouldShowDialog = true;
	},

	methods: {
		/**
		 * ⚡️ e.g.
		 * if select the date which not yet with any record on calendar
		 * (in this case, both `record.clockIn` & `record.clockOut` are empty)
		 */
		showReformatedRecord (record)
		{
			let __record = require('lodash.omit')(record, ['date']);

			__record = Object.entries(__record).map(([timeType, dateValue]) =>
			{
				if (timeType !== 'date')
				{
					dateValue = dateValue.split(':');
					dateValue.length === 1 && (dateValue = [,,]); // ⚡️
				}
				return [timeType, dateValue];
			});
			__record.date = record.date;

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
			if (this.dayValidator) {
				this.record__.date = this.dayValidator.focusedMonthWithYear + '-' + this.record__.date;
			}
			dbService.updateRecord(
			{
				date: this.record__.date,
				...Object.fromEntries(this.record__.map(cb))
			});
			this.shouldShowDialog = false;
			this.dayValidator = undefined;
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