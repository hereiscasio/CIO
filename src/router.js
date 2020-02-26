/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js';
import { firstTimeLoggedIn } from '@/plugins/firebase.js';

Vue.use(Router);

export const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "login" */ '@/components/LoginProcess/BeforeLogin.vue'),
		meta: {
			public: true
		}
	},
	{
		path: '/',
		name: 'clock',
		component: () => import(/* webpackChunkName: "clock" */ '@/components/ClockIn/ClockInContainer.vue'),
		meta: {
			public: false
		},
		children: [{
			path: 'history',
			name: 'history',
			/**
			 * TODO: Seems like `webpackPrefetch` not work as expected
			 */
			component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "history" */ '@/components/HistoryDashboard/HistoryDashboardContainer.vue'),
			meta: {
				public: false
			}
		}]
	}
]

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

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
});

export default router;
