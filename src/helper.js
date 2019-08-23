import Vue from 'vue'
import format from 'date-fns/format'
/**
 * the time formate of "date-fns" based on 24hr
 * i.e. 13:23, 23:17 ...
 */
function getCurrent () {
	const today = Date.now()
	return {
		time: () => format(today, 'kk:mm'),
		date: () => format(today, 'yyyy-LL-dd') // native solution: `new Date().toISOString().substr(0, 10)`
	}
}

export { getCurrent }
export default {
	install () {
		Vue.prototype.$helper = {
			getCurrent
		}
	}
}
