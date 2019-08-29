import Vue from 'vue'
import format from 'date-fns/format'

function getCurrent () {
	const today = Date.now()
	return {
		/**
		 * the time formate of "date-fns" based on 24hr
		 * i.e. 13:23, 23:17 ...
		 */
		time: () => format(today, 'kkmm'),
		/**
		 * Example result: 1990-07-15
		 * @note
		 * native solution: `new Date().toISOString().substr(0, 10)`
		 */
		date: () => Number(format(today, 'yyyyLLdd')),

		timeWithSeparator: () => format(today, 'kk:mm'),
		dateWithSeparator: () => format(today, 'yyyy-LL-dd')
	}
}
// /**
//  * @return '2019-03'
//  */
// function getThisMonthWithYear () {
// 	return Number(format(Date.now(), 'yyyyLL'))
// }

// /**
//  * @param {String} date '1990-07-15' || '1990-07'
//  * @return '1990 Jul'
//  */
// function getYearAndMonthInEnglish (date) {
// 	let _date = date.toString()
// 	return `${getYear(new Date(_date))} ${format(new Date(_date), 'LLL')}`
// }
/**
 * @param {String} str "20160323"
 * @param {String} symbol
 * @output "2016-03-23"
 */
function stringWithSeparator (str, symbol)
{
	const aString = str.toString()

	switch (symbol) {
		case '-':
			const year = aString.slice(0, 4)
			const month = aString.slice(4, 6)
			const day = aString.slice(6, 8)
			return year + symbol + month + (day ? symbol + day : '')

		case ':':
			return aString.slice(0, 2) + symbol + aString.slice(2, 4)
	}
}

function removeDashAndReturnNumber(date) {
	return Number(date.toString().replace(/-/g, ''))
}

export { getCurrent,
	//getYearAndMonthInEnglish,
	stringWithSeparator, removeDashAndReturnNumber }
export default {
	install () {
		Vue.prototype.$helper = {
			getCurrent,
			//getYearAndMonthInEnglish,
			stringWithSeparator,
			removeDashAndReturnNumber
			//, getThisMonthWithYear
		}
	}
}
