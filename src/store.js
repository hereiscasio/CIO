import Vue from 'vue'
import Vuex from 'vuex'

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
		recordsInFocusedMonth: undefined // Object || undefined
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
					date: require('date-fns/format')(Date.now(), 'yyyy-LL-dd')
				};
			}
			else state.todayRecord = payload;
		},

		DEL_MONTH_RECORDS(state)
		{
			state.recordsInFocusedMonth = undefined;
		},

		SET_MONTH_RECORDS(state, payload)
		{
			state.recordsInFocusedMonth = {
				...state.recordsInFocusedMonth, ...payload
			};
		},

		SET_LOGIN_STATE(state, payload)
		{
			state.userIsLogged = payload;
		}
	}
});

export default store;