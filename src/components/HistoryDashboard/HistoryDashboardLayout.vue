<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	:value="true" persistent scrollable
	transition="dialog-bottom-transition"
	content-class='wrapper--history-dashboard'
>
	<v-card tile>

	<v-sheet height='100%' class='overflow-y-hidden' tile>
		<slot
			name='Calendar'
			:shouldShowCalendar='focusedTabTitle === "Calendar"'
		></slot>
		<slot
			name='Table'
			:shouldShowTable='focusedTabTitle === "Table"'
		></slot>
	</v-sheet>
	<v-bottom-navigation
		v-model="focusedTabTitle" horizontal absolute class='elevation-24' color='#3D5AFE'
	>
		<v-btn
			v-for='btn in buttonsInfo' :key='btn.name'
			:value="btn.name"
			@click='btn.trigger'
		>
			{{btn.name}}
			<svg width='24' height='24' class='mr-1 ml-n1'>
				<use :xlink:href="getSvgPath(btn.icon)"></use>
			</svg>
		</v-btn>
	</v-bottom-navigation>

	</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script>
import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';


export default {

	mixins: [getSvgPathMixin],

	data () {
		this.buttonsInfo =
		[
			{
				name:'Leave',
				icon: 'run',
				trigger: () => this.$fire('toggle-history-dashboard', false)
			},
			{
				name:'Calendar',
				icon: 'calendar-range',
				trigger: () => this.$emit('on-click-calendar-tab')
			},
			{
				name:'Table',
				icon: 'view-list',
				trigger: () => {}
			}
		];
		return {
			focusedTabTitle: 'Calendar'
		}
	}
}

</script>

<style lang="scss" scoped>
::v-deep .wrapper--history-dashboard {
	width: 100%;
	height: 100%;
	margin: 0;
	border-radius: 0;
}
::v-deep .v-dialog:not(.v-dialog--fullscreen) { // modify Vuetify default styling
    max-height: 100%;
}
@media (min-width: 563px) {
	::v-deep .wrapper--history-dashboard {
		height: 80%;
		max-width: 320px;
	}
	::v-deep .v-dialog:not(.v-dialog--fullscreen) {
		max-height: 568px;
	}
}
</style>