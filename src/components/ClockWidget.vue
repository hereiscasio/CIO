<template>
<div>
	<v-time-picker
		v-model="currentTime"
		full-width readonly class="elevation-0"
		color='red'
	></v-time-picker>

	<v-dialog v-model="shouldShowSettingsView" fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-toolbar flat color="transparent">
			<v-spacer></v-spacer>
			<v-btn icon @click="shouldShowSettingsView = false">
				<v-icon>close</v-icon>
			</v-btn>
		</v-toolbar>

		Credit
	</v-dialog>

	<v-dialog v-model="shouldShowLogoutConfirmView">
		<v-card>
			<v-card-title class="headline">ARE YOU SURE ?</v-card-title>
			<!-- <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
			-->
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="green darken-1" text
					@click="shouldShowLogoutConfirmView = false"
				>YES
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Hack / Workaround:
		`light`, `data-app` are attr to avoid annoying warning when do the testing
		TODO: it seems like we can scrape `light` out now
	-->
	<v-menu offset-y light data-app close-on-click bottom max-width='164'>
		<template v-slot:activator="{ on }">
			<v-btn
				id='button--menu-on-clock'
				v-on="on" text fab large dark :ripple='false'
			>
				<v-icon dark large>menu</v-icon>
			</v-btn>
		</template>
		<v-list>
			<v-list-item
				v-for="(item, index) in featureListing" :key="index"
				@click='item.trigger'
			>
				<v-list-item-icon class='mr-4'>
					<v-icon v-text="item.icon"></v-icon>
				</v-list-item-icon>
				<v-list-item-title v-text='item.feature'></v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</div>
</template>

<script>

export default {
	data () {
		return {
			currentTime: this.$helper.getCurrent().time(),
			shouldShowSettingsView: false,
			shouldShowLogoutConfirmView: false
		}
	},
	created () {
		this.keepToShowCurrentTime()
		this.featureListing = [
			{
				icon: 'directions_run',
				feature: 'Logout',
				trigger: () => (this.shouldShowLogoutConfirmView = true)

			},
			{
				icon: 'show_chart',
				feature: 'History',
				trigger: () => {}
			},
			{
				icon: 'settings',
				feature: 'Settings',
				trigger: () => (this.shouldShowSettingsView = true)
			}
		]
	},
	methods: {
		keepToShowCurrentTime () {
			setInterval(() => {
				this.currentTime = this.$helper.getCurrent().time()
			},
			1000 * 60)
		}
	}
}
</script>

<style lang='scss' scoped>
::v-deep .v-time-picker-title__time * {
	font-family: krungthep;
}
:root {
	position: relative;
}
#button--menu-on-clock {
	position: absolute;
	top: 0;
	&::before {
		content: none; // remove special effect: ripple related stuff
	}
}
::v-deep .v-time-picker-clock__container {
	padding-top: 16px;
}
</style>
