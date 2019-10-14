/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import Auth from './components/Auth.vue'
import ClockIn from './components/ClockIn/ClockInContainer'
import HistoryDashboard from './components/HistoryDashboard/HistoryDashboardContainer'

Vue.use(Router)
/**
 * TODO: lazy load certain route
 */
export const routes = [
	{
		path: '/login',
		name: 'login',
		component: Auth
	},
	{
		path: '/',
		name: 'clock',
		component: ClockIn,
		children: [{
			path: 'history',
			component: HistoryDashboard
		}]
	}
]
const router = new Router({ routes })

/**
 * by using $vlf, if the stored item (says, `apple`)has been removed
 * then `$vlf.getItem('apple')` will return `null` not `undefined`
 * as if u try to access that variable by using `localStorage.apple` directly
 */
router.beforeEach(async (to, from, next) =>
{
	const phoneNumber = await Vue.prototype.$vlf.getItem('phoneNumber')
	if (
		/**
		 * user haven't login, but he try to access different route
		 * by manual changing url ( e.g. `/clock` )
		 */
		from.name === 'login' && !phoneNumber
		/**
		 * Prevent user who try to manual changing url to access login route
		 * ( i.e. /login )
		 */
		|| ( phoneNumber && to.name === 'login' )
	) {
		next(false)
		return
	}
	next()
})

export default router
