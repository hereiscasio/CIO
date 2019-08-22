<template>
<div class='px-4'>
    <Notification mode='greeting'/>

    <ClockWidget class='mx-n4'/>

    <v-btn
        v-if='shouldShowClockInButton'
        height='52' block tile light elevation='10'
        @click='clockIn' class='font-weight-bold'
    >
        <v-icon left v-text='`timer`'/>&nbsp;CLOCK IN
    </v-btn>
    <v-btn
        v-else-if='shouldShowClockOutButton'
        height='52' block tile light elevation='10'
        @click='clockOut' class='font-weight-bold'
    >
        <v-icon left v-text='`timer_off`'/>&nbsp;CLOCK OUT
    </v-btn>
    <br>
    <TimeFreezer
        v-if='currentClockInTime'  :time='currentClockInTime'
    />
    <TimeFreezer
        v-if='currentClockOutTime' :time='currentClockOutTime'
    />

</div>
</template>
<script>
import Notification from './Notification';
import TimeFreezer from './TimeFreezer';
import ClockWidget from './ClockWidget';
import {isUndefined} from 'lodash-core';
import TYPE from 'vue-types';
export default {
    props: {
        name: String,
        latestClockIn: TYPE.shape({
            time: String,
            date: String
        })
    },
    data () {
        return {
            shouldShowClockInButton : false,
            shouldShowClockOutButton: false,
            currentClockInTime      : undefined,
            currentClockOutTime     : undefined
        }
    },
    watch: {
        latestClockIn: {
            handler: function(value) {
                if (value === undefined) {
                    this.shouldShowClockInButton = true;
                    return;
                }
                this.clockIn(value.time);
            },
            immediate: true
        }
    },
    methods: {
        clockOut() {
            this.shouldShowClockOutButton = false;
            this.currentClockOutTime      = this.$helper.getCurrentTime();
        },
        clockIn(latestClockInTime) {

            this.shouldShowClockInButton  = false;
            this.shouldShowClockOutButton = true;
            this.currentClockInTime = latestClockInTime ? latestClockInTime : this.$helper.getCurrentTime();
        }
    },
    components: {
        Notification, TimeFreezer, ClockWidget
    }
}
</script>

<style lang="scss" scoped>
::v-deep .v-time-picker-title__time * {
    font-family: krungthep;
}
::v-deep .v-picker__title {
    padding-top: 32px;
}
::v-deep .v-time-picker-clock__ampm {
    display: none !important; // hide am pm
}
::v-deep .v-time-picker-clock {
    // add shadow around the time picker
    // TODO: add box shadow on `::v-deep .v-picker__title`
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}
</style>
