<template>
<v-app>
	<router-view class='pa-0 ma-0'/>
	<keep-alive>
		<component :is="componentId"></component>
	</keep-alive>
</v-app>
</template>

<script>
import RecordEditor from '@/components/RecordEditor.vue';
import Settings from '@/components/Settings.vue';
import Logout from '@/components/Logout.vue';
import Notification from '@/components/Notification.vue';

export default
{
	components: {
		RecordEditor, Logout, Settings, Notification
	},

	data() {
		return {
			componentId: ''
		}
	},
	created ()
	{
		this.$subscribe(
			'request-dialog', ({componentId, payload}) =>
			{
				this.componentId = componentId;
				if (
					componentId === 'notification' &&
					localStorage.getItem('showTips') === 'false'
				) {
					return;
				}
				this.$nextTick(() => this.$fire("force-to-show-" + this.componentId, payload));
			}
		);
	}
}
</script>

<style lang="scss">
@import "normalize.css/opinionated.css";
* {
	font-family: 'Space Mono', monospace;
}
/**
 * ︎⚙︎ avoid to "scroll bouncing" ( https://tinyurl.com/y62mvq6k )
 */
body, html {
	overflow: hidden !important;
	height: 100% !important;
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
	overflow-y: auto; // ⚙︎
	height: 100vh !important; // ⚙︎
	display: block !important; // ⏏︎
}
</style>