/* eslint-disable */
import Vue from 'vue'

import Router from 'vue-router'
import Auth from './components/Auth.vue'
import ClockInOut from './components/ClockInOut'
import HistoryDashboard from './components/HistoryDashboard'
Vue.use(Router)

export const routes = [
	// temporarily comment
	{
		path: '/login',
		name: 'login',
		component: Auth
	},
	{
		path: '/',
		name: 'clock',
		component: ClockInOut
	},
	{
		path: '/history',
		name: 'history',
		component: HistoryDashboard
	}
	/**
	 * TODO: lazy load certain page
	 */
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
]

export default new Router({ routes })
