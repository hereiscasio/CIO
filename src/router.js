/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js';
//import Auth from './components/Auth.vue'
// import BeforeLogin from './components/LoginProcess/BeforeLogin.vue'
// import ClockIn from './components/ClockIn/ClockInContainer.vue'
// import HistoryDashboard from './components/HistoryDashboard/HistoryDashboardContainer.vue'

import { firstTimeLoggedIn } from '@/plugins/firebase.js';

Vue.use(Router);

export const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "login" */ '@/components/LoginProcess/BeforeLogin.vue'),
		//component: BeforeLogin,
		meta: {
			public: true
		}
	},
	{
		path: '/',
		name: 'clock',
		component: () => import(/* webpackChunkName: "clock" */ '@/components/ClockIn/ClockInContainer.vue'),
		//component: ClockIn,
		meta: {
			public: false
		},
		children: [{
			path: 'history',
			name: 'history',
			component: () => import(/* webpackChunkName: "history" */ '@/components/HistoryDashboard/HistoryDashboardContainer.vue'),
			// component: HistoryDashboard,
			meta: {
				public: false
			}
		}]
	}
]
const router = new Router({routes});

router.beforeEach(async (to, from, next) =>
{
	if (from.name === null && to.name === 'history') next('/');
	if (
		to.matched.some(config => config.meta.public === false)
	) {
		if (store.state.userIsLogged === undefined)
		{
			await firstTimeLoggedIn ? next() : next('/login');
		}
		else next();
		return;
	}
	/**
	 * want go into /login ? then you should not a logged-in user
	 */
	await firstTimeLoggedIn ? next('/') : next();
})

export default router;
