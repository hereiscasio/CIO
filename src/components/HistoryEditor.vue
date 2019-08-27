<template>
<!-- eslint-disable vue/no-v-html -->
<!-- TODO:
	Vuetify Bug ?
	without `hide-overlay`, this dialog will be overlap by its overlay
-->
<v-dialog
	v-model='shouldShowDialog' persistent hide-overlay max-width="600px" data-app
>
	<v-form v-model="validInputField">
		<v-card>
			<v-card-title>
				<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title class="headline">Edit History</v-list-item-title>
					<v-list-item-subtitle class='text-wrap' v-if='timeData.length === 2'>To use different way to edit the time, please access tab: "Table" shown below</v-list-item-subtitle>
				</v-list-item-content>
				</v-list-item>
			</v-card-title>
			<v-card-text class='pb-0'>
				<v-container class='pb-0'>
					<template v-for='(time, index) in timeData'>
					<v-row :key='index' v-if='timeData.length > 1'>
						{{`Clock-${index === 0 ? 'in' : 'out'} Time`}}
					</v-row>
					<v-row :key='time'>
						<v-col cols="6" class='pb-0'>
							<v-text-field
								label="Hr" v-model='enteredTime.hr[0]'
								:placeholder="enteredTime.hr[0]" outlined
								class='input-field--time-editing-panel'
								v-mask='`##`' :rules="[rules.required, rules.maxHour]"
							>
							</v-text-field>
						</v-col>
						<v-col cols="6" class='pb-0'>
							<v-text-field
								label="Min" v-model='enteredTime.min[0]'
								:placeholder="enteredTime.min[0]" outlined
								class='input-field--time-editing-panel'
								v-mask='`##`' :rules="[rules.required, rules.maxMinute]"
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
					@click="onSaveTimeEditing"
					color="blue darken-1" text
					:disabled="!validInputField"
				>
				SAVE
				</v-btn>
				<v-btn
					@click="shouldShowDialog = false"
					color="blue darken-1" text
				>
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
		})
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
			enteredTime: { hr: '', min: '' },
			validInputField: true,
			shouldShowDialog: false
		}
	},
	watch: {
		timeData: {
			handler (value) {
				if (
					!includes(value, undefined) && value[0] !== ''
				) {
					this.shouldShowDialog = true
					this.enteredTime.hr = this.timeData.map(time => time.split(':')[0])
					this.enteredTime.min = this.timeData.map(time => time.split(':')[1])
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		onSaveTimeEditing () {
			if (!this.validInputField) return
			this.shouldShowDialog = false
		}
	},
	directives: { mask }
}
</script>

<style lang="scss" scoped>
.input-field--time-editing-panel ::v-deep input {
	text-align: center;
}
</style>