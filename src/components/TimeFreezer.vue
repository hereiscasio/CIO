<template>
<v-card
    max-width="344" class="mx-auto"
>
    <v-card-title v-text='`CLOCK IN`'></v-card-title>
    <v-card-text  v-text='time'></v-card-text>
    <!-- <v-card-actions>
    </v-card-actions> -->
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