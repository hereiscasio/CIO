import TimeFreezer from '@/components/TimeFreezer'
import helper from './../../src/helper.js'
import { render, fireEvent, queryByPlaceholderText } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('TimeFreezer ➡️ ', () => {
    /**
         * INPUT: props
         * OUTPUT: rendered Output
         */
        // 似乎在 clock-in-out.test.js 有做 ClockInOut 在點擊 clock-in button 後，
        // assert 頁面上應該會出現持有「目前時間」的元件，進而判斷母組件與子組件運作正常
        // 然後現在又於本檔案再單獨測試子組件：傳進 time, date，會正確顯示 time, date
        // 初步感覺這樣是在浪費測試，因為好像有重疊，但其實沒有，前者測的是 integration
        // 後者是 unit，事實證明，後者運作正常不代表前者運作正常
    const props = {data: { time: '11:15', date: '2019-07-08' }};

    it(`T1: Present time & date if there's such data comes in`, () =>
    {
        const { queryByText, queryByPlaceholderText } = render(TimeFreezer, { props }, installVuetify);
        expect(queryByText(props.data.time)).toBeInTheDocument()
        expect(queryByText(props.data.date)).toBeInTheDocument()
    });

    it(`T2: Present the panel with time once he click button--time-edit on the card`, async () =>
    {
        const { queryByText, queryByPlaceholderText } = render(TimeFreezer, { props }, installVuetify);
        const $buttonToShowPanel = queryByText('edit');

        await fireEvent.click($buttonToShowPanel);
        expect(queryByPlaceholderText('11')).toBeInTheDocument()
        expect(queryByPlaceholderText('15')).toBeInTheDocument()
    });
    // TODO: should reset to default value if user cancel invalid editing action
    it(`T3: If he eliminate any input field to empty, then saved-button will be disabled`, async () =>
    {
        const { queryByText, queryByLabelText } = render(TimeFreezer, { props }, installVuetify);
        const $buttonToShowPanel = queryByText('edit');
        const $hourInputField   = () => queryByLabelText('Hr');
        const $buttonToSaveChanged = () => queryByText('SAVE');

        await fireEvent.click($buttonToShowPanel);
        await fireEvent.update($hourInputField(), '')
        await fireEvent.click($buttonToSaveChanged())

        expect(queryByText('Edit History')).toBeVisible();
    });
    // TODO: auto prefix 0 if user only enter single number into either hr or min input field
    describe(`He can't enter below any character into input field, otherwise, saved-button will be disabled`, () =>
    {

        it(`T4: number > 24 in hour input field`, async () => {

            const { queryByText, queryByLabelText } = render(TimeFreezer, { props }, installVuetify);
            const $buttonToShowPanel = queryByText('edit');
            const $hourInputField   = () => queryByLabelText('Hr');
            const $minuteInputField = () => queryByLabelText('Min');
            const $buttonToSaveChanged = () => queryByText('SAVE');

            await fireEvent.click($buttonToShowPanel);
            await fireEvent.update($hourInputField(), '25')
            await fireEvent.update($minuteInputField(), '53');
            await fireEvent.click($buttonToSaveChanged())

            expect(queryByText('Edit History')).toBeVisible();
        })

        it(`T5: number > 59 in minute input field`, async () => {

            const { queryByText, queryByLabelText } = render(TimeFreezer, { props }, installVuetify);
            const $buttonToShowPanel = queryByText('edit');
            const $hourInputField   = () => queryByLabelText('Hr');
            const $minuteInputField = () => queryByLabelText('Min');
            const $buttonToSaveChanged = () => queryByText('SAVE');

            await fireEvent.click($buttonToShowPanel);
            await fireEvent.update($hourInputField(), '13')
            await fireEvent.update($minuteInputField(), '60')
            await fireEvent.click($buttonToSaveChanged())

            expect(queryByText('Edit History')).toBeVisible();
        })
    })

})
// // Thinking: 要測的功能 lib 或 framework 有提供嗎？有的話就不用測，例「 點擊頁面任意處都可以把 menu 關掉 」
// /**
// * 如何正確使用 testing library 去測試組件之間的互動？
// * 好像不能測子組件的 props?  那要怎麼測由母組件傳進子組件的 contract ? e.g. props
// * TDD 情境：點擊 clock-in 按鈕後，要能在 card 上顯示時間 -> input 是點擊按鈕，output 要怎麼測？
// * -> 不太知道怎麼測的原因可能是整個功能敘述是意味著母元件與子元件完全互動完後的結果，所以實際測試
// * 時當然也只能一次測兩個組件（ 但畢竟目前還在開發初期，所以 card 其實還沒有時作成一個獨立組件 ）
// * 再來就是可以思考要測的這個情境其實是在測一個 container，那當然不好測，最好用 e2e 測
// */
// // TDD 實務開發思考方式：
// // 1. 屬於 Vuetify 元件的不用測：使用者訪問此頁面時，要能正確顯示現在時間
// // 2. 要不斷從UI頁面或功能描述語句中思考：對目前要TDD的功能，i/o 到底有哪些？
// // 3. 與其去測試當進入此頁面時，某個不需要 input data 的按鈕有無呈現，不如去思考跟這個按鈕相關的、
// //    I/O 的測試有哪些？( 或是想辦法用高層次的方式把資料與 UI 分離，改去測試資料 )
// // 4. 原本思考應該不用傳時間/日期到 TimeSnapshot，但因為在測試時要思考組件 I/O，
// //    為了測試，所以決定傳 props: 時間/日期 ( 不然原本思考對於日期的部分，採取讓 TimeSnapshot 自己在內部產生 )
// // Vue-test-utils Bug: 只要放在 setTimeout 中的 assert 都保證會過，不論對錯
