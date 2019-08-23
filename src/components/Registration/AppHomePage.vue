<template>
<v-layout
	id='out-most-bounder--app-home-page' justify-space-between column class='pt-6 px-2'
>
	<v-img
		src='./../../assets/logo.svg'
		class='ml-2' width='256' aspect-ratio="3.82089" contain style='flex: 0'
		alt='logo'
	/>
	<v-card
		id='card--registration' data-cy='card--registration'
		class="mx-auto mb-4 pb-4" color='orange' elevation='5'
		min-width="304" max-width='398' min-height='0' max-height='168'
		:img='imageBackgroundURL'
	>
		<v-card-text class='white--text'>
		To verify your account, please enter your mobile number to receive One Time Password
		</v-card-text>

		<v-card-actions class='pa-4'>
			<v-container grid-list-lg class='py-0 pl-0'>
				<v-layout class='mx-0'>
						<v-flex xs4 class='pl-0 py-0'>
						<v-text-field
							ref='firstTextField'
							data-cy="input--mobile-number"
							@input='takeUserToNextField($event, 1)'
							@focus='autoInsertNumber09'
							v-model="mobileNumber[0]" class='pt-0 mt-0 input--mobile-number'
							v-mask="'####'"
							color='white' type="tel" hide-details required
						/>
					</v-flex>
					<v-flex xs4 class='py-0'>
						<v-text-field
							ref='secondTextField' data-cy="input--mobile-number"
							@input='takeUserToNextField($event, 2)'
							v-model="mobileNumber[1]" class='pt-0 mt-0 input--mobile-number'
							v-mask="'###'"
							color='white' type="tel" hide-details required
						/>
					</v-flex>
					<v-flex xs4 class='py-0'>
						<v-text-field
							ref='thirdTextField' data-cy="input--mobile-number"
							v-model="mobileNumber[2]" class='pt-0 mt-0 input--mobile-number'
							v-mask="'###'"
							color='white' type="tel" hide-details required
						/>
					</v-flex>
				</v-layout>
			</v-container>
			<v-btn
				ref='buttonForRequestOTP'
				v-if='toggleVisibilityOfButton'
				data-cy="button--send-mobile-number"
				fab color='white' small
				@click='makeRequestToReceiveOTP(mobileNumber.join(""))'
			>
				<v-icon medium v-text='`arrow_forward`' color='orange'/>
			</v-btn>
		</v-card-actions>
	</v-card>
</v-layout>
</template>

<script>
import { toNumber, isNaN } from 'lodash-core'
import { mask } from 'vue-the-mask'
export default {
	directives: { mask },
	props: {
		makeRequestToReceiveOTP: { type: Function }
	},
	data () {
		return {
			mobileNumber: [],
			toggleVisibilityOfButton: false
		}
	},
	watch: {
		mobileNumber (value) {
			if (value.length !== 3) {
				this.toggleVisibilityOfButton = false
				return
			}
			if (
				value[0].length === 4 &&
				value[1].length === 3 &&
				value[2].length === 3
			) {
				this.toggleVisibilityOfButton = true
				return
			}
			this.toggleVisibilityOfButton = false
		}
	},
	methods: {
		autoInsertNumber09 () {
			if (this.mobileNumber[0] === undefined) {
				this.$set(this.mobileNumber, 0, '09')
			}
		},
		takeUserToNextField (enteredNumber, nextFieldIndex) {
			if (
				enteredNumber.trim() === '' ||
				isNaN(toNumber(enteredNumber.trim()))
			) {
				return
			}
			if (nextFieldIndex === 1 && enteredNumber.length === 4) {
				this.$refs.secondTextField.focus()
			} else if (nextFieldIndex === 2 && enteredNumber.length === 3) {
				this.$refs.thirdTextField.focus()
			}
		},
		setGradientBackground () {
			this.imageBackgroundURL = require('trianglify')({
				cell_size: 40,
				x_colors: ['#AF4F14', '#F4811E', '#FFFBD1']
			}).png()
		}
	},
	created () {
		this.setGradientBackground()
	}
}
</script>

<style lang='scss' scoped>
#card--registration {
	::v-deep .v-input__slot:before {
		border-color: white;
	}
}
.input--mobile-number ::v-deep input {
	color: white !important;
	text-align: center;
}
#out-most-bounder--app-home-page {
	background: url('./../../assets/bg.png') center center no-repeat;
	background-size: cover
}
</style>
