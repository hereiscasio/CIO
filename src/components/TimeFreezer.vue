<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	min-height='260' min-width="260" class='d-flex flex-column'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6'
	>CLOCK IN
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
	{{data.time}}

		<v-dialog
			v-model="shouldShowTimeEditingPanel"
			persistent max-width="600px" data-app
		>
			<template v-slot:activator="{ on }">
				<v-btn tile v-on="on">
					<v-icon>edit</v-icon>
				</v-btn>
			</template>
			<v-form v-model="validInputField">
				<v-card>
					<v-card-title>
						<span class="headline">Editing Clock-in Time</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" sm="6" md="4">
									<v-text-field
										label="Hr" v-model='enteredTime.hr'
										:placeholder="defaultHour"
										v-mask='`##`' :rules="[rules.required, rules.maxHour]"
									>
									</v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="4">
									<v-text-field
										label="Min" :placeholder="defaultMinute"
										v-model='enteredTime.min'
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
.v-card__title {
		font-size: 32px;
		background: #3D5AFE;
}
.v-card__text {
		font-family: krungthep;
		font-size: 63px;
		flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
</style>
