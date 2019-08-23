<template>
<div>
    <v-time-picker
        v-model="currentTime"
        full-width readonly class="elevation-0"
        color='red'
    ></v-time-picker>

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
			currentTime: this.$helper.getCurrent().time()
		}
	},
	created () {
		this.keepToShowCurrentTime()
		this.featureListing = [
			{
				icon: 'directions_run', feature: 'Logout'
			},
			{
				icon: 'show_chart', feature: 'History'
			},
			{
				icon: 'settings', feature: 'Settings'
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
