<template>
<v-app>
	<router-view class='pa-0 ma-0'/>
	<component
		:payload='payload' :is="componentId" @onHideDialog='componentId = ""'
	></component>
</v-app>
</template>

<script>
const renderByIsFlag = {
	RecordEditor: () => import(/* webpackChunkName: "editor" */ '@/components/Dialog/RecordEditor.vue'),
	Logout: () => import(/* webpackChunkName: "logout" */ '@/components/Dialog/Logout.vue'),
	Settings: () => import(/* webpackChunkName: "setting" */ '@/components/Dialog/Settings.vue'),
	Notification: () => import(/* webpackChunkName: "notify" */ '@/components/Dialog/Notification.vue'),
	Loading: () => import(/* webpackChunkName: "loading" */ '@/components/Dialog/Loading.vue'),
};
export default
{
	components: {
		...renderByIsFlag
	},

	data() {
		return {
			componentId: '',
			payload: ''
		}
	},

	created ()
	{
		/**
		 * USE CASES: `$fire('request-dialog', <componentId>, <payload>)`
		 *
		 * - <componentId>, <payload> are required
		 * - if no payload, should provide <payload> to `''`
		 * - turning off dialog(if need) can be achieved by specifying <componentId> to `''`
		 *
		 */
		this.$subscribe(
			'request-dialog', (componentId, payload) =>
			{
				this.componentId = componentId;
				this.payload = payload;
			}
		);
	}
}
</script>

<style lang="scss">
@import "normalize.css/opinionated.css";
html * {
	font-family: 'Space Mono' !important;
}
/**
 * ♼
 * all below lines are one parts of solution to solve scrolling bug in iPhone Chrome, Safari
 * for the other parts, global search of "♼" in codebase
 */
body, html {
	// overflow: hidden !important; // <--- never add this
	height: 100vh !important;
}

/**
 * ⏏︎ Safari Bug:
 * v-application--wrap height can't be expanded by its directly child
 * the main reason is its directly parent, v-application, declare `display: flex`
 * WARNING:
 * do not declare `height: 100%;` below
 */
.v-application {
	min-width: 320px; // the min size of app = the width of iPhoneSE-like
	// overflow-y: auto; // ⚙︎
	height: 100vh !important; // ⚙︎
	display: block !important; // ⏏︎
}
</style>