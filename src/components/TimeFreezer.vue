<template>
<v-card
    min-height='260' min-width="260" class='d-flex flex-column'
>
    <v-card-title
        class='font-weight-bold white--text pb-4 pt-6'
    >CLOCK IN
    </v-card-title>

    <v-card-text
        class='d-flex justify-center align-center black--text'
    >{{time}}
    </v-card-text>

    <v-card-actions class='justify-center py-4'>
        <span>
        <v-icon>date_range</v-icon>&nbsp;2019-08-09
        </span>
    </v-card-actions>
</v-card>
</template>

<script>
import TYPE from 'vue-types';
export default {
    props: {
        time: String
    }
}
</script>
<style lang="scss" scoped>
.v-card__title {
    font-size: 32px;
    background: #3D5AFE;
}
.v-card__text {
    font-family: krungthep;
    font-size: 63px;
    flex-grow: 1; // TODO: use Vuetify API to achieve the same effect
}
</style>
