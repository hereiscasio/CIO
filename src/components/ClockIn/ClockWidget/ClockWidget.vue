<template>
<div>
	<v-row no-gutters id='wrapper--clock-widget' class='mx-auto'>

		<v-col
			v-if='$vuetify.breakpoint.smAndUp'
			cols='auto' id='toolbar--landscape'
		>
			<WidgetSmAndUp :featureListing='featureListing' :currentTime='currentTime'/>
		</v-col>

		<v-col cols='12' :sm='true' class='pa-0'>
			<v-time-picker
				v-model="currentTime" full-width readonly class="elevation-0" color='primary'
			></v-time-picker>
			<slot name='buttons'></slot>
		</v-col>

	</v-row>

	<WidgetXsOnly v-if='$vuetify.breakpoint.xsOnly' :featureListing='featureListing'/>
</div>
</template>

<script>
import format from 'date-fns/format';

export default {

	data () {
		this.TIME = {ONE_SECOND: 1000, ONE_MINUTE: 1000 * 60};
		this.keepToShowCurrentTime();
		this.featureListing = [
			{
				icon: 'run',
				feature: 'Logout',
				trigger: () => this.showDialog('logout')
			},
			{
				icon: 'chart-bar',
				feature: 'History',
				trigger: () => this.onClickHistoryButton()
			},
			{
				icon: 'cog',
				feature: 'Settings',
				trigger: () => this.showDialog('settings')
			}
		];
		return {
			currentTime: format(Date.now(), 'kk:mm')
		}
	},

	methods: {
		/**
		 * ⚡️
		 * 	1000s is necessary setting, not only for workaround(see below),
		 *  but also for UX consideration.
		 *
		 * 	if fire with router at the same time, Notification dialog will suddenly disappear
		 * 	after it popups in the short of time. so set 1000s to workaround it.
		 */
		onClickHistoryButton()
		{
			const cb = () => {
				const doNotShowTips = localStorage.getItem('showTips') === 'false';
				if (doNotShowTips) return;
				this.showDialog('notification');
			};
			this.headToHistoryPage();
			setTimeout(cb, this.TIME.ONE_SECOND); // ⚡️
		},

		headToHistoryPage() {
			this.$fire('toggle-history-dashboard', true);
		},

		showDialog(dialogId) {
			this.$fire('request-dialog', dialogId, true);
		},

		keepToShowCurrentTime ()
		{
			const setUpCurrentTime = () => this.currentTime = format(Date.now(), 'kk:mm');
			setInterval(setUpCurrentTime, this.TIME.ONE_MINUTE);
		}
	},

	components: {
		WidgetXsOnly: () => import('@/components/ClockIn/ClockWidget/WidgetXsOnly.vue'),
		WidgetSmAndUp: () => import('@/components/ClockIn/ClockWidget/WidgetSmAndUp.vue'),
	}
}
</script>

<style lang='scss' scoped>
$shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;

:root {
	position: relative;
}

::v-deep .v-picker__title { // Toolbar
	padding-top: 32px;
	background: var(--v-primary-base);
	background: linear-gradient(0deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
	box-shadow: $shadow;
	border-radius: 0 !important;
}

::v-deep .v-time-picker-clock__ampm {
	display: none !important; // hide am pm
}

::v-deep .v-picker.v-card, ::v-deep .v-picker__body { // Help to show shadow of Toolbar
  background: transparent !important;
}

::v-deep .v-time-picker-title__time * {
	font-family: krungthep !important;
}

::v-deep .v-time-picker-clock { // add shadow around the time picker
		box-shadow: $shadow;
		background: white !important;
}

::v-deep .v-time-picker-clock__container {
	padding-top: 32px;
}

@media (min-width: 563px) { // if >= 564, then ...
	::v-deep .v-picker__title {
		display: none;
	}
	#wrapper--clock-widget {
		max-width: 516px;
	}
	/**
	* TODO: remove this ugly hack due to bad doc, bad bug of Vuetify
	* that's, success to override $grid-breakpoints, but it still not works
	*/
	.col-sm {
		flex-basis: 0;
		flex-grow: 1;
		max-width: 100%;
	}
}
</style>
