import HistoryDashboard from '@/components/HistoryDashboard'
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

describe.skip('HistoryDashboard.vue ➡️ ', () => // name of unit under test
{
    it.skip(`if user add history in table view, that history will be moved to next date of latest history`, async () => {

        // History Dashboard 一開始就有資料，所以要想辦法透過 render api 藉由 observable 餵資料給它
        //
        const { queryByText, queryAllByLabelText, queryAllByText, debug } = render(HistoryDashboard, {}, installPlugins)
        const $buttonToShowView = tabTitle => queryByText(tabTitle)
        const $buttonToAddHistory = () => queryByText('History').parentNode
        const expectedNumberOfDataAfterAdded = recordByDate.allDates.length + 1
        const $tableItems = () => queryAllByText('edit')
        const $inputFieldsOf = timeType => queryAllByLabelText(timeType);
        const $buttonToSaveChanged = () => queryByText('SAVE');

        await fireEvent.click($buttonToShowView('Table'))
        await fireEvent.click($buttonToAddHistory())
        $inputFieldsOf('Hr').map(async input => await fireEvent.update(input, '11'))
        $inputFieldsOf('Min').map(async input => await fireEvent.update(input, '11'))
        await fireEvent.click($buttonToSaveChanged())
        //debug($tableItems()[3].parentNode.parentNode.firstChild)
        expect($tableItems()).toHaveLength(expectedNumberOfDataAfterAdded)
    })

	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
    it.skip(`popup dialog—history-editing if user make selection at certain date`, async () =>
    {
        const { queryByText } = render(HistoryDashboard, {}, installPlugins)
        const $selectedDate = queryByText('23')
        const $dialogTitle = () => queryByText('Edit History')

        await fireEvent.click($selectedDate)
        expect($dialogTitle()).toBeVisible()
	})

    it(`#UC11US1A Show view: clock-in-out once he leave view: history`, async () =>
    {
		const { queryByText, queryByTestId } = render(HistoryDashboard, {}, installPlugins)
		const $buttonToLeave = queryByText('Leave')
		const $viewOfHistory = () => queryByTestId('view--history-calendar')

		await fireEvent.click($buttonToLeave)

		expect($viewOfHistory()).not.toBeInTheDocument()
    })

	describe(`#UC10 Close usage tip in view: history/calendar`, () =>
	{
		beforeEach(() => {
			localStorage.removeItem('doNotShowUsageTipsAgain')
		})
		/**
		 * TODO: Bug report
		 * 當把 Notification 放在具有 fullscreen + persisitent 的 dialog 外面時，會發現藉由點擊該 Notification
		 * 仍然有辦法關閉 dialog，Vuetify 關閉該 dialog 時，會在具有 .v-dialog 的身上加上 style="display:none"
		 * 但是不知道為什麼靠 Vue-testing-library 永遠抓不到該 style（ 抓不到動態產生的 style ？）
		 *
		 * 事實上，這是 Vuetify bug，所以等官方修正後，就不用測試這種奇怪行為
		 */
		it(`#UC10US1C Usage disappear once he did close it & enter this view again`, () =>
		{
			localStorage.setItem('doNotShowUsageTipsAgain', 1)
			const { queryByText } = render(HistoryDashboard, {}, installPlugins)
			const $buttonToCloseTips = queryByText('close')

			expect($buttonToCloseTips).not.toBeInTheDocument()
		})

		it(`#UC10US1B Usage tip still there if he didn't close it & enter this view again `, () =>
		{
			const { queryByText } = render(HistoryDashboard, {}, installPlugins)
			const $buttonToCloseTips = queryByText('close')

			expect($buttonToCloseTips).toBeVisible()
		})
	})
});