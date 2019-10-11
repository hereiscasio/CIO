<template>
<!-- eslint-disable vue/no-v-html -->
<!-- TODO:
	Vuetify Bug ?
	without `hide-overlay`, this dialog will be overlap by its overlay
-->
<v-dialog
	v-model='shouldShowDialog' persistent hide-overlay max-width="600px" data-app
	:style='{"display": shouldShowDialog ? "inline" : "none"}'
	@click:outside='toggleDialog(false)'
>
	<template v-slot:activator="{ on }" v-show='!noBuiltInTrigger'>
		<v-icon
			v-on="on" class='mr-n1 button--show-record-editor' v-text='`edit`'
			@click='toggleDialog(true)'
		/>
    </template>
	<v-form v-model="validInputField">
		<v-card>
			<v-card-title>
				<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title class="headline primary--text">
						{{typeOfEditing === 'add' ? "Add" : "Edit"}} History
					</v-list-item-title>
					<v-list-item-subtitle class='text-wrap' v-if='timeData.length === 2'>Try to edit time by accessing below tab: "Table"</v-list-item-subtitle>
				</v-list-item-content>
				</v-list-item>
			</v-card-title>
			<v-card-text class='pb-0'>
				<v-container class='pb-0'>
					<template v-for='(time, index) in timeData'>
					<v-row :key='index' v-if='timeData.length > 1'>
						{{`Clock-${index === 0 ? 'in' : 'out'} Time`}}
					</v-row>
					<v-row :key='index+99' :class='layoutRule'>
						<v-col class='pb-0'>
							<v-text-field
								label="Hr" v-model='record.hr[index]'
								:placeholder="record.hr[index]" outlined
								class='input-field--time-editing-panel'
								@change='reformatValueInTextField($event, "hr", index)'
								v-mask='`##`' :rules="[rules.required, rules.maxHour]"
							>
							</v-text-field>
						</v-col>
						<v-col class='pb-0'>
							<v-text-field
								label="Min" v-model='record.min[index]'
								class='input-field--time-editing-panel'
								:placeholder="record.min[index]" outlined
								@change='reformatValueInTextField($event, "min", index)'
								v-mask='`##`' :rules="[rules.required, rules.maxMinute]"
							>
							</v-text-field>
						</v-col>
					</v-row>
					</template>
					<!-- TODO: constraints of `record.date`
						- can't enter date which already existed record
						- can't enter date which is not existed in specific month
					-->
					<template v-if='typeOfEditing === "add" && usedWithTable'>
						<v-row>
							<v-col cols="12" class='pb-0'>
							<v-text-field
								label='day of this month' type='tel' placeholder='e.g. 03' outlined
								v-model='record.date'
								class='input-field--time-editing-panel'
								@change='() => {}'
								v-mask='`##`' :rules="[rules.required]"
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
					@click="onSaveRecordEditing" :disabled="!validInputField" text
				>
				SAVE
				</v-btn>
				<v-btn @click="toggleDialog(false)" text>
				CANCEL
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line
import { isArray, includes } from 'lodash-core'
import { mask } from 'vue-the-mask'
export default {
	props: {
		timeData: TYPE.custom(value => {
			return isArray(value) && value.length >= 1 && value.length <= 2
		}),
		editTarget: String,
		noBuiltInTrigger: Boolean,
		mode: TYPE.string.def('edit'),
		usedWithTable: Boolean
	},
	computed: {
		layoutRule () {
			return this.editTarget === 'clockInOut' ? {
				'flex-column': false
			} : {
				'flex-column': true
			}
		}
	},
	data () {
		return {
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
			record: { hr: [], min: [], date: '' },
			validInputField: true,
			shouldShowDialog: false,
			typeOfEditing: 'edit'
		}
	},
	watch: {
		noBuiltInTrigger: {
			handler (value) {
				if (value) this.toggleDialog(true)
			},
			immediate: true
		},
		timeData: {
			/**
			 * TODO: seems like below logic is too complicated ?
			 */
			handler (value) {
				if (
					!includes(value, undefined) && value[0] !== ''
				) {
					this.record.hr = this.timeData.map(time => time.substr(0, 2))
					this.record.min = this.timeData.map(time => time.substr(2, 4))
				}
				else if (value[0] === '' && value[1] === '') {
					this.typeOfEditing = 'add'
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		reformatValueInTextField(value, timeType, index) {
			if (value.length === 1) {
				this.$set(this.record[timeType], index, '0' + value)
			}
		},

		getEditedResult() {
			let editedResult = {}

			switch (this.editTarget)
			{
				case 'clockIn':
				case 'clockOut':
					editedResult[this.editTarget] = this.record.hr[0] + this.record.min[0]
					break

				case 'clockInOut':
					editedResult.clockIn = this.record.hr[0] + this.record.min[0]
					editedResult.clockOut = this.record.hr[1] + this.record.min[1]
					if (this.record.date) editedResult.date = this.record.date
					break
			}
			return editedResult
		},
		onSaveRecordEditing () {
			if (!this.validInputField) return
			if (this.record.date) {
				this.$emit('finish-record-adding', this.getEditedResult())
			}
			else {
				this.$emit('finish-record-editing', this.getEditedResult())
			}

			this.shouldShowDialog = false
			this.$forceUpdate()
		},
		toggleDialog (onOrOff) {
			if (onOrOff) {
				this.shouldShowDialog = true
				return
			}
			this.shouldShowDialog = false
			this.$forceUpdate()
			this.$emit('cancel-record-editing')
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
</style>