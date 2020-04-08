import getSvgPathMixin from '@/components/mixins/getSvgPathMixin.js';
import ClockWidget from '@/components/ClockIn/ClockWidget/Index.vue';

export default {
	title: 'ClockWidget'
}

export const NotYetTodayClockIn = () => ({
	mixins: [getSvgPathMixin],
	components: {
		ClockWidget
	},
	template: `
	<ClockWidget v-slot:buttons>
		<div class='mx-4 mt-5'>
			<v-btn
				height='52' block tile light elevation='3'
				class='font-weight-bold mb-2'
			>
				<svg width='24' height='24' class='mr-2'>
					<use :xlink:href="getSvgPath('alarm')"></use>
				</svg>CLOCK IN
			</v-btn>
		</div>
	</ClockWidget>
	`
});
export const FinishTodayWork = () => ({
	components: {
		ClockWidget
	},
	template: `
		<ClockWidget v-slot:buttons>
			<div class='mx-4 mt-5'>
			</div>
		</ClockWidget>
	`
});