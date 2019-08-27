import HistoryEditor from '@/components/HistoryEditor'
import helper, { getCurrent } from './../../src/helper.js'
import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('HistoryEditor ➡️ ', () =>
{
    it(`H1: Show 1 pair of input field if place to trigger HistoryEditor is a card`, async () =>
    {
        const props = {timeData: ['11:07']};
        const { queryByLabelText } = render(HistoryEditor, {props}, installVuetify)
        const $inputFieldOf = timeType => queryByLabelText(timeType)

        expect($inputFieldOf('Hr').value).toBe("11");
        expect($inputFieldOf('Min').value).toBe("07");
    })

    it(`H2: Show 2 pair of input field if place to trigger is not a card`, async () =>
    {
        const props = {timeData: ['11:07', '']};
        const { queryAllByLabelText } = render(HistoryEditor, {props}, installVuetify)
        const $inputFieldOf = timeType => queryAllByLabelText(timeType)

        expect($inputFieldOf('Hr')).toHaveLength(2)
        expect($inputFieldOf('Min')).toHaveLength(2)
    })

    // TODO: should reset to default value if user cancel invalid editing action
    it(`H3: If he eliminate any input field to empty, then saved-button will be disabled`, async () =>
    {
        const props = {timeData: ['11:07']};
        const { queryByLabelText, queryByText } = render(HistoryEditor, {props}, installVuetify)
        const $hourInputField   = queryByLabelText('Hr');
        const $buttonToSaveChanged = queryByText('SAVE');

        await fireEvent.update($hourInputField, '')
        await fireEvent.click($buttonToSaveChanged)

        expect(queryByText('Edit History')).toBeVisible();
    });
    // TODO: auto prefix 0 if user only enter single number into either hr or min input field
    describe(`He can't enter below any character into input field, otherwise, saved-button will be disabled`, () =>
    {
        it(`H4: number > 24 in hour input field`, async () =>
        {
            const props = {timeData: ['11:07']};
            const { queryByLabelText, queryByText } = render(HistoryEditor, {props}, installVuetify)
            const $hourInputField   = queryByLabelText('Hr');
            const $minuteInputField = queryByLabelText('Min');
            const $buttonToSaveChanged = queryByText('SAVE');

            await fireEvent.update($hourInputField, '25')
            await fireEvent.update($minuteInputField, '53');
            await fireEvent.click($buttonToSaveChanged)

            expect(queryByText('Edit History')).toBeVisible();
        })

        it(`H5: number > 59 in minute input field`, async () =>
        {
            const props = {timeData: ['11:07']};
            const { queryByLabelText, queryByText } = render(HistoryEditor, {props}, installVuetify)
            const $hourInputField   = queryByLabelText('Hr');
            const $minuteInputField = queryByLabelText('Min');
            const $buttonToSaveChanged = queryByText('SAVE');

            await fireEvent.update($hourInputField, '13')
            await fireEvent.update($minuteInputField, '60');
            await fireEvent.click($buttonToSaveChanged)

            expect(queryByText('Edit History')).toBeVisible();
        })
    })
});