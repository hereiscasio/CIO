<template>
<div>
    <Notification mode='greeting'/>

    <v-time-picker
        v-model="currentTime"
        type="month"
        width="290"
        class="mt-4"
    ></v-time-picker>

    <v-btn
        v-if='shouldShowClockInButton'
        block color="secondary" icon
        @click='clockIn'
    >
        <v-icon left>timer</v-icon>CLOCK IN
    </v-btn>
    <v-btn
        v-else-if='shouldShowClockOutButton'
        block color="secondary" icon
        @click='clockOut'
    >
        <v-icon left>timer_off</v-icon>CLOCK OUT
    </v-btn>

    <TimeFreezer
        v-if='currentClockInTime'  :time='currentClockInTime'
    />
    <TimeFreezer
        v-if='currentClockOutTime' :time='currentClockOutTime'
    />
    <!-- Hack / Workaround:
        `light`, `data-app` are attr to avoid annoying warning when do the testing
    -->
    <v-menu offset-y light data-app close-on-click>
        <template v-slot:activator="{ on }">
            <v-btn
                v-on="on" block color="secondary" icon
            >
                <v-icon left v-text='`menu`'/>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(item, index) in featureListing" :key="index"
            >
                <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text='item.feature'></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

</div>
</template>
<script>
import Notification from './Notification';
import TimeFreezer from './TimeFreezer';
import {isUndefined} from 'lodash-core';
import {getMinutes, getHours} from 'date-fns';
import TYPE from 'vue-types';
export default {
    created() {
        this.keepToShowCurrentTime();
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
        ];
    },
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
            // TODO                 : hide label: AM, PM on UI
            currentTime             : this.getCurrentTime(),
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
            this.currentClockOutTime      = this.getCurrentTime();
        },
        clockIn(latestClockInTime) {
            this.shouldShowClockInButton  = false;
            this.shouldShowClockOutButton = true;
            this.currentClockInTime = latestClockInTime ? latestClockInTime : this.getCurrentTime();
        },
        /**
         * the time formate of "date-fns" based on 24hr
         * i.e. 13:23, 23:17 ...
         */
        getCurrentTime() {
            const today = Date.now();
            let [hr, min] = [getHours(today), getMinutes(today)];

            if (hr.toString().length === 1) hr = '0' + hr;
            if (min.toString().length === 1) min = '0' + min;

            return hr + ':' + min;
        },
        keepToShowCurrentTime() {
            setInterval(() => this.currentTime = this.getCurrentTime(), 1000*60);
        }
    },
    components: {
        Notification, TimeFreezer
    }
}
</script>