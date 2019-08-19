<template>
    <v-snackbar
        id='otpProvider'
        :value='shouldShowSnackBar' color='#F99B2F' dark
        :timeout='0'
    >
        <v-layout
            v-if='mode === "otpProvider"'
            data-cy="snack-bar--otp-provider"
            nowrap
        >
            <v-flex>Your verification code is</v-flex>
            <v-flex class='font-weight-black'>{{otpCode}}</v-flex>
        </v-layout>
    </v-snackbar>
</template>

<script>
/**
 * Question ❓ if try to implement click snackbar to close it
 * should i TDD it ?
 */
export default {
    props: {
        mode: {
            type: String,
            default: ''
        },
        otpCode: {
            type: String,
            default: ''
        }
    },
    computed: {
        shouldShowSnackBar() {
            return this.mode  !== '';
        }
    }
}
</script>

<style lang='scss'>

</style>