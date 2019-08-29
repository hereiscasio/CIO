import TableToShowHistory from '@/components/TableToShowHistory'
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

describe.skip('TableToShowHistory ➡️ ', () => // name of unit under test
{
    let tableItems;

    beforeEach(() => {
        tableItems = [
            {
                date: '2019-08-01',
                clockIn: '08:11',
                clockOut: '18:43'
            },
            {
                date: '2019-08-02',
                clockIn: '09:00',
                clockOut: '18:00'
            },
            {
                date: '2019-08-03',
                clockIn: '10:59',
                clockOut: '18:00'
            }
        ]
    })
    // NOTE: this component should independent with date-picker
    // -> unless user edit time in calendar, it should keep the default view to show when user access
    // TODO: should check whether the input data is the latest date which belong to latest history
    it(`always show specific month which related to latest history when access this view`, async () =>
    {
        const props = {tableItems}
        const expectedTableTitle = getYearAndMonthInEnglish(tableItems[0].date)
        const { queryByText } = render(TableToShowHistory, {props}, installPlugins)
        const $tableTitle = queryByText(expectedTableTitle)

        expect($tableTitle).toBeVisible();
    })

    describe(`Add history ➡️`, () => {

        // TODO: should always get latest history from server when access this view
        // where `focusedDate` is the date which related to latest clock-in & clock-out
        it.skip(`disable button—add-history if there was a latest data in focused
            month which already had clock-in but no corresponding clock-out`, () =>
        {
            const props = {
                focusedDate: getCurrent().date(),
                recordByDate: [
                    {
                        date: 1,
                        clockIn: '08:11',
                        clockOut: '18:43'
                    },
                    {
                        date: 2,
                        clockIn: '09:00',
                        clockOut: '18:43'
                    },
                    {
                        date: 3,
                        clockIn: '09:00',
                        clockOut: ''
                    }
                ]
            }
            const { queryByText } = render(TableToShowHistory, {props}, installPlugins)
            const $buttonToAddHistory = queryByText('History').parentNode

            expect($buttonToAddHistory).toHaveClass('v-btn--disabled');
        })
    })
})