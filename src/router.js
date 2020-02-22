/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import Auth from './components/Auth.vue'
import ClockIn from './components/ClockIn/ClockInContainer.vue'
import HistoryDashboard from './components/HistoryDashboard/HistoryDashboardContainer.vue'

Vue.use(Router)
/**
 * TODO: lazy load certain route
 */
export const routes = [
	{
		path: '/login',
		name: 'login',
		// component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
		component: Auth
	},
	{
		path: '/',
		name: 'clock',
		// component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
		component: ClockIn,
		meta: {
			requiresAuth: true
		},
		children: [{
			path: 'history',
			// component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
			component: HistoryDashboard,
			meta: {
				requiresAuth: true
			}
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
