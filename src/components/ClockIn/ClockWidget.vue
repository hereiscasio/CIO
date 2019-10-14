<template>
<div>
	<v-row no-gutters id='wrapper--clock-widget' class='mx-auto'>
		<v-col cols='auto' id='toolbar--landscape'>
			<v-card
				class="mx-auto" height="100%" width="196" elevation='10'
			>
				<v-navigation-drawer
					class="transparent" dark permanent
				>
					<v-list dense>
					<v-list-item
						v-for="item in featureListing"
						:key="item.icon"
						link
					>
						<v-list-item-content>
						<v-btn outlined tile x-large @click='item.trigger'>
							<v-icon left>{{ item.icon }}</v-icon>
							{{ item.feature }}
						</v-btn>
						</v-list-item-content>
					</v-list-item>
					</v-list>

					<template v-slot:append>
					<div id='digital-time--landscape'>
						{{currentTime}}
					</div>
					</template>
				</v-navigation-drawer>
			</v-card>
		</v-col>
		<v-col cols='12' :sm='true' class='pa-0'>
			<v-time-picker
				v-model="currentTime"
				full-width readonly class="elevation-0" color='primary'
			></v-time-picker>
			<slot></slot>
		</v-col>
	</v-row>

	<v-dialog v-model="shouldShowSettingsView" fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-card flat color='black' dark class='pa-4 pt-12'>
			<v-btn
				color='#3D5AFE' fab dark absolute right top text large
				@click="shouldShowSettingsView = false"
				class='mt-10'
			>
				<v-icon>close</v-icon>
			</v-btn>
			<v-container>
				<v-row no-gutters>
					<v-col>
						<v-card color='transparent'>
							<v-card-title>Credit</v-card-title>
							<v-card-text>
								Built by independent fullstack developer:
								Casio, all right preserved. For source
								code, check this
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col>
						<v-card color='transparent'>
							<v-card-title>Suggestions</v-card-title>
							<v-card-text>Feel free to contact at hereiscasio@gmail.com</v-card-text>
						</v-card>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col>
						<v-card color='transparent'>
							<v-card-title>System Information</v-card-title>
							<v-card-text>. . .</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-container>

		</v-card>
	</v-dialog>

	<v-dialog v-model="shouldShowLogoutConfirmView" max-width="320">
		<v-card>
			<v-card-title class="headline">ARE YOU SURE ?</v-card-title>

			<v-card-text>
				Once you confirm this operation,
				all your data can not be recovered + You need to
				run the registration process again
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="red" text class='font-weight-black' large
					@click="confirmToLogout"
				>YES
				</v-btn>
				<v-btn
					class='grey--text mr-3' large text
					@click="shouldShowLogoutConfirmView = false"
				>CANCEL
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
			shouldShowSettingsView: false,
			shouldShowLogoutConfirmView: false,
			currentTime: this.reformatTimeWithSeparator()
		}
	},
	created () {
		this.keepToShowCurrentTime()
		this.populateItemsInMenu()
	},
	methods: {
		populateItemsInMenu() {
			this.featureListing = [
				{
					icon: 'directions_run',
					feature: 'Logout',
					trigger: () => (this.shouldShowLogoutConfirmView = true)
				},
				{
					icon: 'show_chart',
					feature: 'History',
					trigger: () => this.$router.push({ path: 'history' })
				},
				{
					icon: 'settings',
					feature: 'Settings',
					trigger: () => (this.shouldShowSettingsView = true)
				}
			]
		},
		reformatTimeWithSeparator() {
			return this.$helper.getCurrent().timeWithSeparator()
		},
		keepToShowCurrentTime ()
		{
			setInterval(() => {
				this.currentTime = this.reformatTimeWithSeparator()
			}, 1000 * 60)
		},
		confirmToLogout () {
			this.shouldShowLogoutConfirmView = false
			this.$firebase.auth().signOut().then(this.removeAllDataRelatedToThisUser)
		},
		/**
		 * TODO: Remove all data saved by $vlf at once
		 */
		removeAllDataRelatedToThisUser()
		{
			this.$db.ref(this.$root.uid).remove()
			this.$vlf.removeItem('doNotShowTipAnyMore')
			this.$vlf.removeItem('phoneNumber')
			this.$root.uid = undefined
		}
	}
}
</script>

<style lang='scss' scoped>
$shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;

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
::v-deep .v-time-picker-title__time * {
	font-family: krungthep;
}

::v-deep .v-time-picker-clock__container {
	padding-top: 16px;
}

::v-deep .v-picker__title, #toolbar--landscape > .v-card { // Toolbar
	padding-top: 32px;
	background: var(--v-primary-base);
	background: linear-gradient(0deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
	box-shadow: $shadow
}

::v-deep .v-picker__body { // Help to show shadow of Toolbar
	background: transparent;
}

::v-deep .v-time-picker-clock__ampm {
	display: none !important; // hide am pm
}

.v-picker.v-card, .v-picker__body {
  background: transparent !important;
}

::v-deep .v-time-picker-clock { // add shadow around the time picker
		box-shadow: $shadow;
		background: #EEEEEE;
}

#toolbar--landscape {
	display: none;
}

::v-deep .v-time-picker-clock__container {
	padding-top: 32px;
}

@media (min-width: 599px) { // if >= 600, then ...
	::v-deep .v-picker__title, #button--menu-on-clock {
		display: none;
	}
	#toolbar--landscape {
		display: block;
	}
	#wrapper--clock-widget {
		max-width: 516px;
	}
	#digital-time--landscape {
		font-size: 50px;
		text-align: center;
		font-family: krungthep;
		color: white;
		padding-bottom: 8px;
	}
}
</style>
