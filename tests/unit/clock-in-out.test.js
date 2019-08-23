import ClockInOut from '@/components/ClockInOut'
import helper, { getCurrent } from './../../src/helper.js'
import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('ClockInOut ➡️ ', () => // name of unit under test
{
	describe('Notification ➡️', () => {
		/**
		 * INPUT: user name + token: firstTimeUse
		 * OUTPUT: notification
		 */
		it(`C1: Only show say-hello-notification if user is 1st time to access this view`, () => {
			localStorage.setItem('firstTimeUse', undefined)
			const { queryByText } = render(ClockInOut, { props: { name: 'Jack' } }, installVuetify)
			const $notification = queryByText('Hello', { exact: false })

			expect($notification).toBeInTheDocument()
		})

		/**
		 * INPUT: user interaction
		 * OUTPUT: rendered Output
		 */
		it(`C2: Hide say-hello-notification once user turn off it`, async () => {
			localStorage.setItem('firstTimeUse', undefined)
			const { queryByText } = render(ClockInOut, { props: { name: 'Jack' } }, installVuetify)
			const $buttonToTurnOff = queryByText('close')
			const $notification = () => queryByText('Hello', { exact: false })

			await fireEvent.click($buttonToTurnOff)

			expect($notification()).not.toBeInTheDocument()
		})

		/**
		 * INPUT: user name + token: firstTimeUse
		 * OUTPUT: rendered Output
		 */
		it(`C3: Shouldn't show say-hello-notification if use access this view again`, () => {
			localStorage.setItem('firstTimeUse', false)
			const { queryByText } = render(ClockInOut, { props: { name: 'Jack' } }, installVuetify)
			const $notification = queryByText('Hello', { exact: false })

			expect($notification).not.toBeInTheDocument()
		})
	})

	describe(`TimeFreezer ➡️`, () => {
		/**
		 * INPUT: history data
		 * OUTPUT: rendered Output
		 */
		it(`C5: Show clock-in-button, if user haven't clock in today`, () => {
			const props = { name: 'Jack', latestClockIn: undefined }
			const { queryByText } = render(ClockInOut, { props }, installVuetify)
			const $buttonToClockIn = () => queryByText('timer')
			const $buttonToClockOut = () => queryByText('timer_off')

			expect($buttonToClockIn()).toBeInTheDocument()
			expect($buttonToClockOut()).not.toBeInTheDocument()
		})
		/**
				 * INPUT: history data
				 * OUTPUT: rendered Output
				 */
		it(`C6: Show clock-out-button & a card which record clock-in data
								if user have clocked in today`, () => {
			const props = { name: 'Jack', latestClockIn: { time: '11:15', date: '2019-07-08' } }
			const { queryByText } = render(ClockInOut, { props }, installVuetify)
			const $buttonToClockIn = () => queryByText('timer')
			const $buttonToClockOut = () => queryByText('timer_off')

			expect($buttonToClockIn()).not.toBeInTheDocument()
			expect($buttonToClockOut()).toBeInTheDocument()
			expect(queryByText(props.latestClockIn.time)).toBeInTheDocument()
		})

		/**
		 * INPUT: user interaction
		 * OUTPUT: rendered Output
		 */
		it(`C7: Show clock-out-button & a card which record clock-in data
			once user perform clock in`, async () =>
		{
			localStorage.setItem('firstTimeUse', undefined);
			const { queryByText } = render(ClockInOut, { props: { name: 'Jack' } }, installVuetify);
			const $buttonToClockIn = () => queryByText('timer');
			const $buttonToClockOut = () => queryByText('timer_off');

			await fireEvent.click($buttonToClockIn());

			expect($buttonToClockIn()).not.toBeInTheDocument()
			expect($buttonToClockOut()).toBeInTheDocument()
		})

		/**
		 * INPUT: user interaction
		 * OUTPUT: rendered Output
		 */
		it(`C9: Show 2 cards which record clock-in/out data once user perform clock out`, async () =>
		{
			const props = { name: 'Jack', latestClockIn: { time: '11:15', date: '2019-07-08' } }
			const { queryByText, getByText } = render(ClockInOut, { props }, installVuetify)
			const $buttonToClockIn = () => queryByText('timer')
			const $buttonToClockOut = () => queryByText('timer_off')
			const timeOfClockedOut = getCurrent().time()

			await fireEvent.click($buttonToClockOut())

			expect($buttonToClockIn()).not.toBeInTheDocument()
			expect($buttonToClockOut()).not.toBeInTheDocument()

			expect(queryByText(props.latestClockIn.time)).toBeInTheDocument()
			expect(queryByText(props.latestClockIn.date)).toBeInTheDocument()
			expect(queryByText(timeOfClockedOut)).toBeInTheDocument()
		})
	})
})
