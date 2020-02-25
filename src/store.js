import Vue from 'vue'
import Vuex from 'vuex'
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {

		userIsLogged: undefined, // boolean
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
		recordsInFocusedMonth: undefined
	},

	getters: {
		todayRecord: state =>
		{
			if (state.recordsInFocusedMonth)
			{

				console.group('RUN : getters > todayRecord');
				console.log('function return: ', state.recordsInFocusedMonth[format(Date.now(), 'yyyy-LL-dd')]);
				console.groupEnd();
				return state.recordsInFocusedMonth
				[
					format(Date.now(), 'yyyy-LL-dd')
				];
			}
			return undefined;
		}
	},

	mutations:
	{
		SET_TRACKED_RECORDS(state, payload) {
			state.recordsInFocusedMonth = payload;
			console.warn('state.recordsInFocusedMonth = ', state.recordsInFocusedMonth);
		},
		SET_LOGIN_STATE(state, payload)
		{
			console.warn('state.userIsLogged = ', state.userIsLogged);
			state.userIsLogged = payload;
		}
	}
});

export default store;