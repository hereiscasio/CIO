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
		}
	}
]

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach(async (to, from, next) =>
{
	const headToAuthorizedPage = to.matched.some(config => config.meta.public === false);
	if (
		headToAuthorizedPage
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
