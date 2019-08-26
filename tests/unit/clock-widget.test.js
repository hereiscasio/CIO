import ClockWidget from '@/components/ClockWidget'
import helper, { getCurrent } from './../../src/helper.js'
import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('ClockWidget ➡️ ', () => // name of unit under test
{
	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
	it(`C1: toggle view--setting if user activate/deactivate it via
		button--show-more-features/button--close-settings-view`, async () =>
	{
		const { queryByText } = render(ClockWidget, {}, installVuetify)
		const $buttonToShowMenu = queryByText('menu')
		const $oneOfInfoOnSettingsView = () => queryByText('Credit')
		const $buttonToShowSettingsView = () => queryByText('Settings')
		const $buttonToHideSettingsView = () => queryByText('close')

		await fireEvent.click($buttonToShowMenu)
		await fireEvent.click($buttonToShowSettingsView())
		await fireEvent.click($buttonToShowSettingsView())

		expect($oneOfInfoOnSettingsView()).toBeVisible()

		await fireEvent.click($buttonToHideSettingsView())

		expect($oneOfInfoOnSettingsView()).not.toBeVisible()
	});

	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
	it(`C2: toggle view--logout-confirmation if user activate/deactivate it via
		button--show-more-features/button--confirm-to-logout
	`, async () => {
		const { queryByText } = render(ClockWidget, {}, installVuetify)
		const $buttonToShowMenu = queryByText('menu')
		const $buttonToShowLogoutView = () => queryByText('Logout')
		const $titleOnLogoutPanel = () => queryByText('ARE YOU SURE ?')
        const $buttonToConfirmLogout = () => queryByText('YES')

		await fireEvent.click($buttonToShowMenu)
		await fireEvent.click($buttonToShowLogoutView())

		expect($titleOnLogoutPanel()).toBeVisible()

		await fireEvent.click($buttonToConfirmLogout())
		expect($titleOnLogoutPanel()).not.toBeVisible()
	});

	it(`C3: show view--history-dashboard if user activate
		it via button--show-more-features`, async () =>
	{
		const { queryByText } = render(ClockWidget, {}, installVuetify)
		const $buttonToShowMenu = queryByText('menu')
		const $buttonToShowHistoryView = () => queryByText('History')
		const $buttonToHideHistory = () => queryByText('leave')

		await fireEvent.click($buttonToShowMenu)
		await fireEvent.click($buttonToShowHistoryView())

		expect($buttonToHideHistory()).toBeVisible()
	})
})