/* eslint-disable */
import Vue from 'vue'

import Router from 'vue-router'
import AppHomePage from './components/Registration/AppHomePage.vue'
import Auth from './components/Auth.vue'
import OtpVerification from './components/Registration/OtpVerification'
import ClockInOut from './components/ClockInOut'
import HistoryDashboard from './components/HistoryDashboard'
Vue.use(Router)

export const routes = [
	// temporarily comment
	// {
	// 	path: '/landing',
	// 	name: 'landing',
	// 	component: Auth
	// },
	{
		path: '/',
		name: 'clock',
		component: ClockInOut
	},
    {
		path: '/signup',
		name: 'home',
		component: AppHomePage
	},
	{
		path: '/otp',
		name: 'otp',
		component: OtpVerification
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
