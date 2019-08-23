<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	min-height='260' min-width="260" class='d-flex flex-column'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6 card-title--time-freezer'
	>CLOCK IN
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
        <v-badge color='transparent'>
			<template v-slot:badge>
			<v-icon class='mr-n1' @click='shouldShowTimeEditingPanel = true'>edit</v-icon>
			</template>

			<span class="time--time-freezer">
			{{data.time}}
			</span>
        </v-badge>

		<v-dialog
			v-model="shouldShowTimeEditingPanel"
			persistent max-width="600px" data-app
		>
			<v-form v-model="validInputField">
				<v-card>
					<v-card-title>
						<span class="headline">Editing Clock-in Time</span>
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
										label="Min" :placeholder="defaultMinute"
										v-model='enteredTime.min' outlined
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
							@click="shouldShowTimeEditingPanel = false"
							color="blue darken-1" text
						>
						CANCEL
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

	</v-card-text>

	<v-card-actions class='justify-center py-4'>
		<span>
		<v-icon>date_range</v-icon>&nbsp;{{data.date}}
		</span>
	</v-card-actions>
</v-card>
<!--eslint-enable-->
</template>

<script>
import { mask } from 'vue-the-mask'
import TYPE from 'vue-types' // eslint-disable-lin
export default {
	directives: { mask },
	props: {
		data: TYPE.shape({
			time: String,
			date: String
		})
	},
	data () {
		return {
			validInputField: true,
			shouldShowTimeEditingPanel: false,
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
			}
		}
	},
	// FIXME: can not show default input value when open dialog
	computed: {
		defaultHour () {
			return this.data.time.split(':')[0]
		},
		defaultMinute () {
			return this.data.time.split(':')[1]
		}
	},
	methods: {
		onSaveTimeEditing () {
			if (!this.validInputField) return
			this.shouldShowTimeEditingPanel = false
		}
	}
}
</script>
<style lang="scss" scoped>
.card-title--time-freezer {
	font-size: 32px;
	background: #3D5AFE;
}
.v-card__text {
	font-family: krungthep;
	font-size: 63px;
	flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
.v-badge__badge .v-icon {
    font-size: 18px;
}
.input-field--time-editing-panel ::v-deep input {
	text-align: center;
}
.time--time-freezer {
	font-family: krungthep;
}
</style>
