import HistoryDashboard from '@/components/HistoryDashboard'
import helper, { getCurrent } from './../../src/helper.js'
import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('HistoryDashboard ➡️ ', () => // name of unit under test
{
	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
    it(`can only leave this view by clicking tab—hide-history-dashboard`, async () =>
    {
		const { queryByText } = render(HistoryDashboard, {}, installVuetify)
		const $buttonToLeave = () => queryByText('Leave')

		await fireEvent.click($buttonToLeave())

		expect($buttonToLeave()).not.toBeVisible()
    })

	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
    it(`when access this view, always show usage tips which can be closed manually by clicking button--close-notification`, async () =>
    {
        const { queryByText } = render(HistoryDashboard, {}, installVuetify)
        const $buttonToCloseTips = () => queryByText('close')

        expect($buttonToCloseTips()).toBeVisible()
        await fireEvent.click($buttonToCloseTips())

        expect($buttonToCloseTips()).not.toBeInTheDocument()
    })

	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
    it(`popup dialog—history-editing if user make selection at certain date`, async () =>
    {
        const props = {dateData: '2019-08-23'}
        const { queryByText } = render(HistoryDashboard, {props}, installVuetify)
        const $selectedDate = queryByText('23')
        const $dialogTitle = () => queryByText('Edit History')

        await fireEvent.click($selectedDate)
        expect($dialogTitle()).toBeVisible()
    })

	/**
	 * INPUT: user interaction
	 * OUTPUT: rendered Output
	 */
    it(`can access specific view ( "Date", "Table" ) by clicking related tab`, async () =>
    {
        const props = {dateData: '2019-08-23'}
        const { queryByText, queryByTestId } = render(HistoryDashboard, {props}, installVuetify)
        const $buttonToShowView = tabTitle => queryByText(tabTitle)
        const $viewOf = tabTitle => queryByTestId(`view--history-${tabTitle.toLowerCase()}`)

        await fireEvent.click($buttonToShowView('Table'))
        expect($viewOf('Table')).toBeVisible()

        await fireEvent.click($buttonToShowView('Date'))
        expect($viewOf('Date')).toBeVisible()
    })
});