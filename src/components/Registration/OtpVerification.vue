<template>
<!-- TODO: smooth transition of this component  -->
<!-- <v-slide-x-transition hide-on-leave> -->
<v-card
		data-cy='view--otp-verification'
		color='orange' height='100%' dark class='px-8 pt-1'
		:img='imageBackgroundURL' tile
>
		<v-toolbar flat color='transparent' class='pa-0 mx-n7 mb-2'>
				<v-btn
						icon color='white' data-cy="button--to-app-home-page"
						@click="$emit('showThisPage', 'AppHomePage')"
				>
						<v-icon v-text='`arrow_back`'/>
				</v-btn>
		</v-toolbar>
		<v-card-title class='title justify-center pb-4'>
				Verification Code
		</v-card-title>
		<v-card-text class='px-0'>
				Wait for a moment to receive the 4 digit code. If you have multiple codes, make sure to type the latest one.
		</v-card-text>
		<v-card-actions class='pa-0'>
		<v-container grid-list-md class="px-0">
			<v-layout>
				<v-flex xs12 sm3>
					<v-text-field
						ref='textFieldWithIndex0' class='input--otp-number'
						@input='takeUserToNextField($event, 1)'
						v-model='otpNumber[0]' type='tel' required hide-details
						data-cy="input--otp-number"
						v-mask="'#'"
					/>
				</v-flex>
				<v-flex xs12 sm3>
					<v-text-field
						ref='textFieldWithIndex1' class='input--otp-number'
						@input='takeUserToNextField($event, 2)'
						v-model='otpNumber[1]' type='tel' required hide-details
						data-cy="input--otp-number"
						v-mask="'#'"
					/>
				</v-flex>
				<v-flex xs12 sm3>
					<v-text-field
						ref='textFieldWithIndex2' class='input--otp-number'
						@input='takeUserToNextField($event, 3)'
						v-model='otpNumber[2]' type='tel' required hide-details
						data-cy="input--otp-number"
						v-mask="'#'"
					/>
				</v-flex>
				<v-flex xs12 sm3>
					<v-text-field
						ref='textFieldWithIndex3' class='input--otp-number'
						v-model='otpNumber[3]' type='tel' required hide-details
						data-cy="input--otp-number"
						v-mask="'#'"
					/>
				</v-flex>
			</v-layout>
		</v-container>
		</v-card-actions>
</v-card>
<!-- </v-slide-x-transition> -->
</template>

<script>
import { toNumber, isNaN } from 'lodash-core'
import { mask } from 'vue-the-mask'
export default {
	directives: { mask },
	data () {
		return {
			otpNumber: []
		}
	},
	watch: {
		otpNumber: {
			handler (value) {
				if (value.length === 4) {
					this.$emit('showThisPage', 'HistoryDashboard')
				}
			}
		}
	},
	methods: {
		/**
		 * TODO: Smooth background transition
		 */
		setGradientBackground () {
			/*
			 * const colorVariations = {
			 * 	deep  : ['#DB5B00', '#872E06', '#AF4F14', '#BF4E08'],
			 * 	medium: ['#F99B2F', '#F99F34', '#F4811E', '#F9AE61'],
			 * 	light : ['#FFFBD1', '#FFFBD0', '#FFDD86', '#FFC25C']
			 * };
			 * let currentVariations = [
			 * 	colorVariations.deep[0],colorVariations.medium[0], colorVariations.light[0]
			 * ];
			 */
			this.imageBackgroundURL = require('trianglify')(
				{
					cell_size: 20,
					x_colors: ['#DB5B00', '#F99B2F', '#FFFBD1']
				})
				.png()
			/*
			 * setInterval(() => {
			 * 	let number = Math.floor(   Math.random() * (0 - 3 + 1) + 3);
			 * 	this.imageBackgroundURL = require('trianglify')(
			 * 	{
			 * 		//cell_size: 20, x_colors: currentVariations
			 * 		cell_size: 20,
			 * 		x_colors: [
			 * 			colorVariations.deep[number],
			 * 			colorVariations.medium[number],
			 * 			colorVariations.light[number]
			 * 		]
			 * 	})
			 * 	.png();
			 * }, 2500);
			 */
		},
		takeUserToNextField (enteredNumber, nextFieldIndex) {
			if (
				enteredNumber.trim() === '' ||
				isNaN(toNumber(enteredNumber.trim()))
			) {
				return
			}

			this.$refs['textFieldWithIndex' + nextFieldIndex].focus()
		}
	},
	created () {
		this.setGradientBackground()
	}
}
</script>
<style lang="scss" scoped>
.input--otp-number ::v-deep input {
	color: white !important;
	text-align: center;
}
</style>
