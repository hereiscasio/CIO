<template>
<v-snackbar
		:value='shouldShowSnackBar' color='#F99B2F' dark :timeout='0'
>
		<v-layout
				v-if='mode === "otpProvider"'
				data-cy="snack-bar--otp-provider" nowrap
		>
				<v-flex>Your verification code is</v-flex>
				<v-flex class='font-weight-black'>{{otpCode}}</v-flex>
		</v-layout>

		<template v-else-if='mode === "greeting"'>
				Hello, {{name}}
				<v-btn
						@click="shouldShowSnackBar = false" text icon
				>
						<v-icon v-text='`close`'/>
				</v-btn>
		</template>
</v-snackbar>
</template>

<script>
/**
 * Question ❓ if try to implement click snackbar to close it
 * should i TDD it ?
 */
import TYPE from 'vue-types'
export default {
  props: {
    name: String,
    mode: TYPE.string.def(''),
    otpCode: TYPE.string.def('')
  },
  data () {
    return {
      shouldShowSnackBar: false
    }
  },
  methods: {
    /**
		 * FIXME:
		 * below `case undefined: ` is a edge case which haven't test
		 */
    sayHelloToUserInCertainCircumstance () {
      switch (localStorage.firstTimeUse) {
        case undefined:
        case 'undefined':
          localStorage.setItem('firstTimeUse', false)
          this.shouldShowSnackBar = true
          break

        case 'true': this.shouldShowSnackBar = false; break
      }
    }
  },
  watch: {
    mode: {
      handler: function (val) {
        switch (val) {
          case 'greeting':
            this.sayHelloToUserInCertainCircumstance()
            debugger
            break

          case '': this.shouldShowSnackBar = false; break
        }
      },
      immediate: true

    }
  }
}
</script>
