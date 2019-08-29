import ClockWidget from '@/components/ClockWidget'
import helper, { getCurrent, stringWithSeparator } from './../../src/helper.js'
import { render, fireEvent, wait } from '@testing-library/vue'
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
/**
 * import router, store 到 main.js 時，都不需做這件事（ 因為已經在 store.js, router.js 先做了 ）
 * 但是對測試來說應該是不行，要額外執行
 */
Vue.use(Router)
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(helper)
Vue.use(http) // FIXME: seems like this stuff works, but the behavior is not what we expected to

/**
 * Reset to avoid sharing mutated state to different tests
 *
 * it will now work if we try to use Vuex's `replaceState`
 * with lodash's `cloneDeep` to reset
 * all states when try to render component
 */
const installPlugins = () => {
	store.commit('RESET_ALL')
	return ({vuetify: new Vuetify(), store, router})
}

/**
 * 2 ways to work with Vuex & Router
 *
 * <1> use localVue to install router & store
 * ============================================
 * import { storeConfig } from './../../src/store'
 * import { routes } from './../../src/router'
 * const installVuetify = () => ({vuetify: new Vuetify()})
 * render(Component, {routes, storeConfig}, installVuetify)
 *
 * <2> use Vue to install router & store
 * ============================================
 * import Vuex from 'vuex'
 * import Router from 'vue-router'
 * import store from './../../src/store'
 * import router from './../../src/router'
 * Vue.use(Router)
 * Vue.use(Vuex)
 * const installPlugins = () => ({vuetify: new Vuetify(), store, router})
 * render(Component, {}, installPlugins)
 */

/**
 * @note #UC4US1A is satisfied due to the testing scenario is the built-in feature of Vuetify
 */
describe('ClockWidget.vue ➡️ ', () => // name of unit under test
{
	/**
	 * @include #UC13US1A
	 * @note including #UC13US1A is just a quick pass
	 */
	it(`#UC3US1A Show settings view once click "Settings" on more-features-listing menu`, async () =>
	{
		const { queryByText } = render(ClockWidget, {}, installPlugins)
		const $buttonToShowMenu = queryByText('menu')
		const $oneOfInfoOnSettingsView = () => queryByText('Credit')
		const $buttonToShowSettingsView = () => queryByText('Settings')
		const $buttonToHideSettingsView = () => queryByText('close')

		await fireEvent.click($buttonToShowMenu)
		await fireEvent.click($buttonToShowSettingsView())

		expect($oneOfInfoOnSettingsView()).toBeVisible()

		await fireEvent.click($buttonToHideSettingsView())

		expect($oneOfInfoOnSettingsView()).not.toBeVisible()
	});


	describe(`#UC2 Click "Logout" menu item ➡️`, () =>
	{
		let queryByText;
		const $buttonToShowLogoutView = () => queryByText('Logout')
		const $titleOnLogoutPanel = () => queryByText('ARE YOU SURE ?')
		const $buttonToConfirmLogout = () => queryByText('YES')
		const $buttonToShowMenu = () => queryByText('menu')
		/**
		 * INPUT: user interaction
		 * OUTPUT: rendered Output
		 */
		it(`#UC2US2A Show dialog after he request to logout`, async () =>
		{
			queryByText = render(ClockWidget, {}, installPlugins).queryByText

			await fireEvent.click($buttonToShowMenu())
			await fireEvent.click($buttonToShowLogoutView())

			expect($titleOnLogoutPanel()).toBeVisible()
		});

		/**
		 * FIXME: below should test by e2e
		 */
		it(`#UC2US2B Redirect to view: registration-start once he confirm logout`, async () =>
		{
			queryByText = render(ClockWidget, {}, installPlugins).queryByText
			mockHttp.DELETE()
			await fireEvent.click($buttonToShowMenu())
			await fireEvent.click($buttonToShowLogoutView())
			await fireEvent.click($buttonToConfirmLogout())

			expect($titleOnLogoutPanel()).not.toBeVisible()
		})
	})

	it(`#UC8US3B Show sub view: calendar if he access history view `, async () =>
	{
		const { queryByText, queryByTestId } = render(ClockWidget, {}, installPlugins)
		const $buttonToShowMenu = queryByText('menu')
		const $buttonToShowHistoryView = () => queryByText('History')
		const $viewOfHistory = () => queryByTestId('view--history-calendar')

		await fireEvent.click($buttonToShowMenu)
		await fireEvent.click($buttonToShowHistoryView())
		await wait($viewOfHistory)
	})
})