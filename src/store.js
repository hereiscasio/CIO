/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import { keyBy, union, property, without, includes, set, sortedIndex, startsWith, map } from 'lodash-core'
import { getCurrent, removeDashAndReturnNumber } from './helper'
Vue.use(Vuex)
export const storeConfig = {
	state: {
		todayRecord: undefined,
		recordByDate: {},
		allRecordDates: []
	},
	mutations: {
		/**
		 * @note
		 * This mutations also stand for data updating
		 * `payload` = {date, clockIn, clockOut}
		 */
		PUT_RECORD(state, payload) {
			// FIXME: need to refactor
			if (
				(state.todayRecord && state.todayRecord.date === payload.date) ||
				state.todayRecord === undefined && payload.date === getCurrent().date()
			) {
				state.todayRecord = payload
			}
			payload.date = Number(payload.date)
			state.recordByDate = {
				...state.recordByDate,
				...{[payload.date]: payload}
			}
			state.allRecordDates = union(state.allRecordDates, [payload.date])
		},
		/**
		 * @param {*} state
		 * @param {*} payload
		 *
		 */
		PUT_MULTIPLE_RECORDS(state, payload) {
			payload = map(payload, e => set(e, 'date', Number(e.date)))
			state.recordByDate = {
				...state.recordByDate,
				...keyBy(payload, 'date')
			}
			state.allRecordDates = union(state.allRecordDates, map(payload, property('date')))
			// FIXME: not the best way
			state.todayRecord = state.recordByDate[state.todayRecord.date]
		},
		DELETE_RECORD(state, payload) {
			if (payload.date === state.todayRecord.date) {
				state.todayRecord = undefined // FIXME: need to refactor
			}
			Vue.delete(state.recordByDate, payload.date)
			state.allRecordDates = without(state.allRecordDates, payload.date)
		},
		REMOVE_EVERY_THINGS(state) {
			state.recordByDate = {}
			state.allRecordDates = []
			state.todayRecord = undefined
		},
		RESET_TODAY_RECORD(state) {
			state.todayRecord = undefined
		},
		//FIXME: refactor `REMOVE_EVERY_THINGS` to this
		RESET_ALL(state) {
			state.recordByDate = {}
			state.allRecordDates = []
			state.todayRecord = undefined
		}
	},
	actions: {

	},

	getters: {
		/**
		 * @param {String|Number} monthWithYear 201903
		 */
		getRecordsInCertainMonth: state => monthWithYear =>
		{
			const _monthWithYear = monthWithYear.toString()
			const datesAsString = map(state.allRecordDates, String)
			const datesWithoutDay = map(datesAsString, e => !startsWith(e, _monthWithYear) || e)
			const datesInThisMonth = without(datesWithoutDay, true)
			if (datesInThisMonth.length === 0) return []
			return map(datesInThisMonth, e => state.recordByDate[e])
		},
		getRecordByDate: state => date => {
			const formatedDate = removeDashAndReturnNumber(date)
			return state.recordByDate[formatedDate]
		},
		haveRecordOnCertainDate(state) {
			return date => {
				return includes(state.allRecordDates, date)
			}
		},
		haveTodayRecord(state) {
			return () => includes(state.allRecordDates, getCurrent().date())
		},
		/**
		 * Below are only work if `haveTodayRecord()` is falsy
		 */
		getPreviousLatestRecord(state) {
			return () => {
				const dateOfToday = getCurrent().date()
				const targetIndex = sortedIndex(state.allRecordDates, dateOfToday) - 1

				if (targetIndex === -1) return null

				return state.allRecordDates[targetIndex]
			}
		}
	}
}
const store = new Vuex.Store(storeConfig)

export default store