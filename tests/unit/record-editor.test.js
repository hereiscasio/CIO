import RecordEditor from '@/components/RecordEditor'
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

describe('RecordEditor ➡️ ', () => {

	let props

	beforeEach(() => {
		props = {timeData: ['11:07'], noBuiltInTrigger: true};
	})

	it(`H1: Show 1 pair of input field if place to trigger RecordEditor is a card`, async () =>
	{
		const { queryByLabelText } = render(RecordEditor, {props}, installPlugins)
		const $inputFieldOf = timeType => queryByLabelText(timeType)

		expect($inputFieldOf('Hr').value).toBe("11");
		expect($inputFieldOf('Min').value).toBe("07");
	})

	it(`H2: Show 2 pair of input field if place to trigger is not a card`, async () =>
	{
		props.timeData = ['11:07', '']
		const { queryAllByLabelText } = render(RecordEditor, {props}, installPlugins)
		const $inputFieldOf = timeType => queryAllByLabelText(timeType)

		expect($inputFieldOf('Hr')).toHaveLength(2)
		expect($inputFieldOf('Min')).toHaveLength(2)
	})

	/**
	 * @note #UC7US1D is satisfied due to the testing scenario is the built-in feature of Vuetify
	 * TODO: auto prefix 0 if user only enter single number into either hr or min input field
	 */
    describe(`#UC7US1C Can't save changed if he make invalid input at input field`, () =>
    {
		it(`he eliminate any input field to empty`, async () =>
		{
			const { queryByLabelText, queryByText } = render(RecordEditor, {props}, installPlugins)
			const $hourInputField   = queryByLabelText('Hr');
			const $buttonToSaveChanged = queryByText('SAVE');

			await fireEvent.update($hourInputField, '')
			await fireEvent.click($buttonToSaveChanged)

			expect(queryByText('Edit History')).toBeVisible();
		});
		it(`number > 24 in hour input field`, async () =>
        {
            const { queryByLabelText, queryByText } = render(RecordEditor, {props}, installPlugins)
            const $hourInputField   = queryByLabelText('Hr');
            const $minuteInputField = queryByLabelText('Min');
            const $buttonToSaveChanged = queryByText('SAVE');

            await fireEvent.update($hourInputField, '25')
            await fireEvent.update($minuteInputField, '53');
            await fireEvent.click($buttonToSaveChanged)

            expect(queryByText('Edit History')).toBeVisible();
        })

        it(`number > 59 in minute input field`, async () =>
        {
            const { queryByLabelText, queryByText } = render(RecordEditor, {props}, installPlugins)
            const $hourInputField   = queryByLabelText('Hr');
            const $minuteInputField = queryByLabelText('Min');
            const $buttonToSaveChanged = queryByText('SAVE');

            await fireEvent.update($hourInputField, '13')
            await fireEvent.update($minuteInputField, '60');
            await fireEvent.click($buttonToSaveChanged)

            expect(queryByText('Edit History')).toBeVisible();
        })
    })
})
