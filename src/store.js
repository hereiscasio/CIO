import Vue from 'vue'
import Vuex from 'vuex'
import format from 'date-fns/format';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		todayRecord: undefined,  // Object || undefined
		userIsLogged: undefined, // boolean || undefined
		/**
		 * ============
		 * DATA FORMAT
		 * ===========
		 * 2020-02-03: {
		 * 	date: 2020-02-03, clockIn: 12:03, clockOut: 23:48
		 * },
		 * 2020-02-24: {
		 * 	...
		 * }
		 */
		recordsInFocusedMonth: undefined,
		/**
		 * e.g. 2020-02
		 */
		focusedMonthWithYear: undefined
	},

	mutations:
	{
		/**
		 * @param {undefined | Object} payload
		 */
		SET_TODAY_RECORD(state, payload)
		{
			if (payload === undefined)
			{
				state.todayRecord = {
					date: format(Date.now(), 'yyyy-LL-dd')
				};
			}
			else state.todayRecord = payload;
		},

		SET_FOCUSED_MONTH_WITH_YEAR(state, payload) {
			state.focusedMonthWithYear = payload;
		},

		SET_MONTH_RECORDS(state, payload)
		{
			state.recordsInFocusedMonth = payload;
		},

		SET_LOGIN_STATE(state, payload)
		{
			state.userIsLogged = payload;
		}
	}
});

export default store;