<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	min-height='260' min-width="260" class='d-flex flex-column'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6 card-title--time-freezer'
	>CLOCK IN
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
        <v-badge color='transparent'>
			<template v-slot:badge>
			<v-icon class='mr-n1' @click='shouldShowHistoryEditor = true'>edit</v-icon>
			</template>

			<span class="time--time-freezer">
			{{data.time}}
			</span>
        </v-badge>

		<HistoryEditor v-if='shouldShowHistoryEditor' :timeData='[data.time]'/>
	</v-card-text>

	<v-card-actions class='justify-center py-4'>
		<span>
		<v-icon>date_range</v-icon>&nbsp;{{data.date}}
		</span>
	</v-card-actions>
</v-card>
<!--eslint-enable-->
</template>

<script>
import HistoryEditor from './HistoryEditor'
import TYPE from 'vue-types' // eslint-disable-line
export default {
	props: {
		data: TYPE.shape({
			time: String,
			date: String
		})
	},
	data () {
		return {
			shouldShowHistoryEditor: false
		}
	},
	components: { HistoryEditor }
}
</script>
<style lang="scss" scoped>
.card-title--time-freezer {
	font-size : 32px;
	background: #3D5AFE;
}
.v-card__text {
	font-family: krungthep;
	font-size: 63px;
	flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
.v-badge__badge .v-icon {
    font-size: 18px;
}
.time--time-freezer {
	font-family: krungthep;
}
</style>
