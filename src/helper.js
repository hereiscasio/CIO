import Vue from 'vue'
import { getMinutes, getHours, getDate, getYear, getMonth } from 'date-fns/fp'
/**
 * the time formate of "date-fns" based on 24hr
 * i.e. 13:23, 23:17 ...
 */
function getCurrentTime () {
	const today = Date.now()
	let [hr, min] = [getHours(today), getMinutes(today)]

	if (hr.toString().length === 1) hr = '0' + hr
	if (min.toString().length === 1) min = '0' + min

	return hr + ':' + min
}

/**
 * TODO: use date-fns to simplify below logic
 */
function getCurrentDate () {
	const today = Date.now()
	let [year, month, date] = [getYear(today), getMonth(today), getDate(today)]

	if (date.toString().length === 1) date = '0' + date
	if (month.toString().length === 1) month = '0' + month

	return year + '-' + month + '-' + date
}
export { getCurrentTime }
export default {
	install () {
		Vue.prototype.$helper = {
			getCurrentTime, getCurrentDate
		}
	}
}
