import ClockInOut from '@/components/ClockInOut'
import helper, { getCurrent, stringWithSeparator } from './../../src/helper.js'
import { render, fireEvent, wait, waitForElement } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import store from './../../src/store'
import router from './../../src/router'
import Vuetify from 'vuetify'
import axios from 'axios'
import { mockHttp } from './http-mocker'

const http = {
    install() {
        Vue.prototype.$http = axios;
    }
};
Vue.use(Vuetify)
Vue.use(helper)
Vue.use(http)
Vue.use(Router)
Vue.use(Vuex)

const installPlugins = () => {
	store.commit('RESET_ALL')
	return ({vuetify: new Vuetify(), store, router})
}

describe(`📄 clock-in-out.test`, () =>
{
	// 如果用戶在裝置A打卡上班，隔天改用裝置B時（ 裝置 B 並沒有在之前最近打卡當天使用過 ）
	// App 要怎麼判定顯示什麼東西給用戶看？
	// ：去要本日的歷史要不到，而且本地的 oneDayHistory 又為空，但其實上次的打卡還沒結束
	// SOL：server 會在前端請求本日歷史時，判定資料庫是否有未完成的歷史，所以伺服器上要存個 flag 藉以判定這種事
	//
	it(`#UC6US1A Show result after perform clock-out`, async () =>
	{
		mockHttp.PATCH()
		const clockInTime = mockHttp.GET()
		const $buttonToHideClockInCard = () => queryByText('close')
		const numberOfCardsToPresentTime = () => queryAllByText(clockInTime).length
		const $buttonTo = st => queryByText(st === 'ClockIn' ? 'timer' : 'timer_off')
		const { queryByText, queryAllByText } = render(ClockInOut, {}, installPlugins)

		await wait(() => $buttonTo('ClockOut'))
		await fireEvent.click($buttonTo('ClockOut'));

		expect($buttonTo('ClockIn')).not.toBeInTheDocument()
		expect($buttonTo('ClockOut')).not.toBeInTheDocument()
		expect(numberOfCardsToPresentTime()).toBe(2)
		expect($buttonToHideClockInCard()).not.toBeInTheDocument()
	})
	it(`#UC12US1A Card will disappear once he delete this record`, async () =>
	{
		mockHttp.DELETE()
		const clockInTime = mockHttp.GET()
		const $card = () => queryByTestId('card--clock-in-out')
		const $buttonToDeleteRecord = () => queryByText('close');
		const $cardWithCurrentTime = () => queryByText(clockInTime)
		const { queryByText, queryByTestId } = render(ClockInOut, {}, installPlugins)

		await wait($cardWithCurrentTime)
		await fireEvent.click($buttonToDeleteRecord());

		expect($card()).not.toBeInTheDocument()
	})

	// TODO:
	// should have corresponding, much high level integration testing
	// for REST related scenario
	/**
	 * @include #UC12US2A, #UC7US1A, #UC7US1B
	 * @type integration
	 * @note
	 */
	it(`#UC12US2B Show edited time on card after he finish editing`, async () =>
	{
		localStorage.setItem('firstTimeUse', false)
		localStorage.setItem('userId', '0966001596')
		const editedClockInTime = '1200'

		const clockInTime = mockHttp.GET()

		axios.patch = jest.fn(() => Promise.resolve({data: {clockIn: editedClockInTime}}))
		const $buttonToShowPanel = () => queryByText('edit');
		const $cardWithTime = time => queryByText(stringWithSeparator(time, ':'))
		const panelWithTitle = () => queryByText('Edit History')
		const $hourInputField   = () => queryByLabelText('Hr');
		const $buttonToSaveChanged = () => queryByText('SAVE');
		const { queryByText } = render(ClockInOut, {}, installPlugins)

		await wait(() => $cardWithTime(clockInTime))
		await fireEvent.click($buttonToShowPanel());

		expect(panelWithTitle()).toBeVisible()

		await fireEvent.update($hourInputField, editedClockInTime.substr(0, 2))
		await fireEvent.click($buttonToSaveChanged())
		await wait(() => $cardWithTime(editedClockInTime))
	})

	describe('#UC1 Close say-hello notification  ➡️', () => {
		beforeEach(() => {
			localStorage.setItem('firstTimeUse', true)
			localStorage.setItem('userId', '0966001596')
			axios.get = jest.fn(() => Promise.resolve({data: null}))
		})
		/**
		 * INPUT: token1: firstTimeUse + token2: userId
		 * OUTPUT: rendered result
		 */
		it(`#UC1US1A Popup notification if he is 1st time to access view: clock-in-out `, () =>
		{
			const { queryByText } = render(ClockInOut, {}, installPlugins)
			const $notification = queryByText(`Hello, ${localStorage.userId}`)

			expect($notification).toBeInTheDocument()
		})

		/**
		 * INPUT: token1: firstTimeUse + token2: userId
		 * OUTPUT: rendered Output
		 * TODO:
		 * onces server verify registration, set `firstTimeUse` to 'true'
		 * & start render ClockInOut.vue
		 * we check the value of `firstTimeUse` to determine if user re-access this view again
		 */
		it(`#UC1US1C Notification will not shown once he access view: clock-in-out again`, () =>
		{
			localStorage.setItem('firstTimeUse', false)
			const { queryByText } = render(ClockInOut, {}, installPlugins)
			const $notification = queryByText(`Hello, ${localStorage.userId}`)

			expect($notification).not.toBeInTheDocument()
		})
	})

	describe(`#UC19 Re-access view: clock-in-out`, () =>
	{
		beforeEach(() => {
			localStorage.setItem('firstTimeUse', false)
			localStorage.setItem('userId', '0966001596')
		})

		it(`#UC19US3A Show certain stuffs if he haven't perform today clock-out`, async () =>
		{
			const clockInTime = mockHttp.GET()
			const timeOnClockInCard = () => queryByText(clockInTime)
			const $buttonTo = st => queryByText(st === 'ClockIn' ? 'timer' : 'timer_off')
			const $buttonOfHidingClockInCard = () => queryByText('close')
			const { queryByText } = render(ClockInOut, {}, installPlugins)

			await wait(() => $buttonTo('ClockOut'))

			expect(timeOnClockInCard()).toBeInTheDocument()
			expect($buttonTo('ClockIn')).not.toBeInTheDocument()

			expect($buttonOfHidingClockInCard()).toBeInTheDocument()
		})
		it(`#UC19US1A Show certain stuffs if he complete today clock-in-out`, async () =>
		{
			mockHttp.PATCH()
			const clockInTime = mockHttp.GET()
			const $buttonOfHidingClockInCard = () => queryByText('close')
			const $buttonTo = st => queryByText(st === 'ClockIn' ? 'timer' : 'timer_off')
			const $thereExist2Cards = () => queryAllByText(clockInTime).length === 2
			const { queryByText, queryAllByText } = render(ClockInOut, {}, installPlugins)

			await waitForElement(() => !$buttonTo('ClockIn'))
			await fireEvent.click($buttonTo('ClockOut'))
			await waitForElement(() => !$buttonTo('ClockOut'))

			expect($thereExist2Cards()).toBeTruthy()
			expect($buttonTo('ClockIn')).not.toBeInTheDocument()
			expect($buttonTo('ClockOut')).not.toBeInTheDocument()
			expect($buttonOfHidingClockInCard()).not.toBeInTheDocument()
		})

		it(`#UC19US2A Show certain stuffs if he haven't perform today clock-in`, async () =>
		{
			axios.get = jest.fn(() => Promise.resolve())

			const noAnyCardToPresentTime = () => queryAllByTestId('card--clock-in-out').length === 0
			const $buttonTo = st => queryByText(st === 'ClockIn' ? 'timer' : 'timer_off')
			const { queryByText, queryAllByTestId } = render(ClockInOut, {}, installPlugins)
			await wait(() => $buttonTo('ClockIn'))
			console.warn('#UC19US2A: store.state.allRecordDates', store.state.allRecordDates);
			expect($buttonTo('ClockOut')).not.toBeInTheDocument()
			expect(noAnyCardToPresentTime()).toBeTruthy()
		})
	})

	it(`#UC5US1A Show result after he perform clock-in`, async () =>
	{

		mockHttp.POST()
		localStorage.setItem('firstTimeUse', false)
		localStorage.setItem('userId', '0966001596')
		const clockInTime = mockHttp.GET()
		axios.get = jest.fn(() => Promise.resolve())
		const $cardWithCurrentTime = () => queryByText(clockInTime)
		const $buttonTo = st => queryByText(st === 'ClockIn' ? 'timer' : 'timer_off')
		const $buttonToHideClockInCard = () => queryByText('close')
		const { queryByText, debug } = render(ClockInOut, {}, installPlugins);

		await wait(() => $buttonTo('ClockIn'))
		await fireEvent.click($buttonTo('ClockIn'));

		expect($buttonTo('ClockIn')).not.toBeInTheDocument()
		expect($buttonTo('ClockOut')).toBeInTheDocument()
		expect($buttonToHideClockInCard()).toBeInTheDocument()
		expect($cardWithCurrentTime()).toBeInTheDocument()
	})
})
