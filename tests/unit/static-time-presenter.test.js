import StaticTimePresenter from '@/components/StaticTimePresenter'
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

describe('StaticTimePresenter.vue 📄', () => {
    /**
         * INPUT: props
         * OUTPUT: rendered Output
         */
        // 似乎在 clock-in-out.test.js 有做 ClockInOut 在點擊 clock-in button 後，
        // assert 頁面上應該會出現持有「目前時間」的元件，進而判斷母組件與子組件運作正常
        // 然後現在又於本檔案再單獨測試子組件：傳進 time, date，會正確顯示 time, date
        // 初步感覺這樣是在浪費測試，因為好像有重疊，但其實沒有，前者測的是 integration
        // 後者是 unit，事實證明，後者運作正常不代表前者運作正常
	/**
	 * @Dependency: #UC12, #UC7
	 */
    it(`Present time & date on card if receive such input`, () =>
    {
		const props = { time: getCurrent().time() };
		const { queryByText } = render(StaticTimePresenter, { props }, installPlugins);
		const $cardWithCurrentTime = queryByText(getCurrent().timeWithSeparator())
		const $cardWithDateOfToday = queryByText(getCurrent().dateWithSeparator())

		expect($cardWithCurrentTime).toBeInTheDocument()
		expect($cardWithDateOfToday).toBeInTheDocument()
    });

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
