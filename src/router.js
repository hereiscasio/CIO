/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js';
import Auth from './components/Auth.vue'
import ClockIn from './components/ClockIn/ClockInContainer.vue'
import HistoryDashboard from './components/HistoryDashboard/HistoryDashboardContainer.vue'

import { firstTimeLoggedIn } from '@/plugins/firebase.js';

Vue.use(Router);
/**
 * TODO: lazy load certain route
 */
export const routes = [
	{
		path: '/login',
		name: 'login',
		// TODO: component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
		component: Auth,
		meta: {
			public: true
		}
	},
	{
		path: '/',
		name: 'clock',
		// TODO: component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
		component: ClockIn,
		meta: {
			public: false
		},
		children: [{
			path: 'history',
			name: 'history',
			// TODO: component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
			component: HistoryDashboard,
			meta: {
				public: false
			}
		}]
	}
]
const router = new Router({routes});

router.beforeEach(async (to, from, next) =>
{
	if (
		to.matched.some(config => config.meta.public === false)
	) {
		console.warn(store.state.userIsLogged);
		if (store.state.userIsLogged === null)
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
