<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	:value='shouldShowDialog' persistent max-width="600px" data-app
>
	<v-form v-model="validInputField">
		<v-card>
			<v-card-title>
				<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title class="headline">Edit History</v-list-item-title>
					<v-list-item-subtitle v-if='mode === "history"'>To use different way to edit the time, please access tab: "Table" shown below</v-list-item-subtitle>
				</v-list-item-content>
				</v-list-item>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="6">
							<v-text-field
								label="Hr" v-model='enteredTime.hr'
								:placeholder="defaultHour" outlined
								class='input-field--time-editing-panel'
								v-mask='`##`' :rules="[rules.required, rules.maxHour]"
							>
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field
								label="Min" v-model='enteredTime.min'
								:placeholder="defaultMinute" outlined
								class='input-field--time-editing-panel'
								v-mask='`##`' :rules="[rules.required, rules.maxMinute]"
							>
							</v-text-field>
						</v-col>
					</v-row>
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
import { mask } from 'vue-the-mask'
export default {
	props: {
		mode: TYPE.string.isRequired,
		defaultTime: TYPE.string.isRequired
	},
	// FIXME: can not show default input value when open dialog
	computed: {
		defaultHour () {
			return this.defaultTime.split(':')[0]
		},
		defaultMinute () {
			return this.defaultTime.split(':')[1]
		}
	},
	data () {
		return {
			enteredTime: {
				hr: this.defaultHour,
				min: this.defaultMinute
			},
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
			validInputField: true,
			shouldShowDialog: true
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