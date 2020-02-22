<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	v-if='time'
	width='100%' min-height='260' class='d-flex flex-column'
	data-testid='card--clock-in-out'
>
	<v-card-title
		class='font-weight-bold white--text pb-4 pt-6 card--clock-in-out'
	>{{title}}
	<template v-if='deletable'>
		<v-spacer></v-spacer>
		<!-- click 可能不起作用了❗️❗️❗️ -->
		<svg width='24' height='24' @click='$emit(`click-close-button`)'>
			<use xlink:href="@/assets/sprite.svg#close"></use>
		</svg>
		<!-- <v-icon dark v-text='`close`' @click='$emit(`click-close-button`)'/> -->
	</template>
	</v-card-title>

	<v-card-text
		class='d-flex justify-center align-center black--text'
	>
        <span class="time--time-freezer">
			{{timeWithSeparator}}
			<slot/>
		</span>
	</v-card-text>

	<v-card-actions class='justify-center py-4'>
		<span>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#calendar-range"></use>
			</svg>
			&nbsp;{{dateOfToday}}
		<!-- <v-icon>date_range</v-icon>&nbsp;{{dateOfToday}} -->
		</span>
	</v-card-actions>
</v-card>
<!--eslint-enable-->
</template>

<script>
import TYPE from 'vue-types' // eslint-disable-line
export default {
	props: {
		time: String,
		title: String,
		deletable: Boolean
	},
	computed: {
		timeWithSeparator() {
			return this.$helper.stringWithSeparator(this.time, ':')
		}
	},
	created() {
		this.dateOfToday = this.$helper.getCurrent().dateWithSeparator()
	}
}
</script>
<style lang="scss" scoped>
.card--clock-in-out {
	font-size : 32px;
	background: var(--v-primary-base);
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
	position: relative; // a base to align trigger of "RecordEditor"
	font-family: krungthep;
}
</style>
