/// <reference types="Cypress" />
export function generateRandomIntegerBetween (lowerBound, upperBound) {
  if (
    lowerBound === upperBound ||
        typeof lowerBound !== 'number' ||
        typeof upperBound !== 'number'
  ) {
    throw 'invalid input format'
  }
  return Math.floor(Math.random() * (lowerBound - upperBound + 1) + upperBound)
}

export default {
  generateRandomMobileNumber () {
    cy.wrap([
      '09' + generateRandomIntegerBetween(10, 99),
      generateRandomIntegerBetween(100, 999),
      generateRandomIntegerBetween(100, 999)
    ])
      .as('randomMobileNumber')
  },
  access_app_home_page () {
    cy.visit('/')
    cy
      .get('[data-cy="button--send-mobile-number"]')
      .should('not.be.visible')
  },

  click_to_send_my_mobile_number_again () {
    cy
      .get('[data-cy="button--send-mobile-number"]')
      .click()
    cy
      .get('[data-cy="input--otp-number"]')
      .each($input => expect($input.val()).to.be.empty)
    cy
      .get('[data-cy="view--otp-verification"]')
      .should('be.visible')
    cy
      .get('[data-cy="snack-bar--otp-provider"]')
      .should('not.be.visible')
  },

  enter_valid_OTP () {
    const fakeOtpNumber = [0, 3, 2, 0]
    cy
      .get('[data-cy="input--otp-number"]')
      .each(($input, index) => {
        cy.wrap($input).type(fakeOtpNumber[index])
      })
    cy
      .get('[data-cy="view--dashboard--home"]')
      .should('be.visible')
  },

  back_to_app_home_page () {
    cy
      .get('[data-cy="button--to-app-home-page"]')
      .click()
    cy
      .get('[data-cy="view--otp-verification"]')
      .should('not.be.visible')
    cy
      .get("[data-cy='card--registration']")
      .should('be.visible')
    cy
      .get('[data-cy="input--mobile-number"]')
      .eq(1)
      .invoke('val')
      .should('not.be.empty')
  },
  /**
     * Should not take user to next input field
     * if enter invalid character
     */
  enter_non_numeric_character_into_otp_input_field () {
    this
      .focus_on_input_of_otp_number(0)
      .type('X')
      .then($firstInput => {
        expect($firstInput.is(':focus')).to.be.true
        cy
          .wrap($firstInput)
          .type('@')

        expect($firstInput.is(':focus')).to.be.true
        cy
          .wrap($firstInput)
          .type(' ')

        expect($firstInput.is(':focus')).to.be.true
      })
  },
  entered_invalid_amount_of_characters_into_certain_input_of_mobile_number () {
    this
      .focus_on_input_of_mobile_number(0)
      .focus()
      .should('have.value', '09')
      .type('6')
      .then($firstInput => {
        expect($firstInput.is(':focus')).to.be.true
      })
  },
  /**
     * System only insert number "09" automatically when
     * user first time to focus on first input of mobile number
     * so if focus that field again, the system should not eliminate
     * anything in that field
     */
  click_on_first_input_of_mobile_number_again () {
    this
      .focus_on_input_of_mobile_number(0)
      .then($firstInputOfMobileNumber => {
        const number = $firstInputOfMobileNumber.val()
        expect(number).to.have.lengthOf(4)
        cy
          .wrap($firstInputOfMobileNumber)
          .focus()
          .invoke('val')
          .then(mobileNumber => {
            expect(mobileNumber).to.have.lengthOf(4)
          })
      })
  },
  entered_non_numeric_into_certain_input_of_mobile_number () {
    this
      .focus_on_input_of_mobile_number(0)
      .focus()
      .should('have.value', '09')
      .type('X')
      .then($firstInput => {
        expect($firstInput.is(':focus')).to.be.true
        cy
          .wrap($firstInput)
          .type('@')

        expect($firstInput.is(':focus')).to.be.true
        cy
          .wrap($firstInput)
          .type(' ')

        expect($firstInput.is(':focus')).to.be.true
      })
  },

  /**
     * should take user to next input if enter valid characters
     */
  enter_valid_mobile_number_into_each_input_in_order (providedNumber) {
    let fakeMobileNumber = ['0966', '001', '596']
    if (providedNumber) {
      fakeMobileNumber = providedNumber
    }
    this
      .focus_on_input_of_mobile_number(0)
      .type('{selectall}' + fakeMobileNumber[0])

    this
      .focus_on_input_of_mobile_number(1)
      .then($secondInput => {
        expect($secondInput.is(':focus')).to.be.true
        cy
          .wrap($secondInput)
          .type('{selectall}' + fakeMobileNumber[1])
      })
    this
      .focus_on_input_of_mobile_number(2)
      .then($thirdInput => {
        expect($thirdInput.is(':focus')).to.be.true
        cy
          .wrap($thirdInput)
          .type('{selectall}' + fakeMobileNumber[2])
      })
  },

  click_to_send_my_mobile_number_for_registration () {
    return {
      happy_path: () => {
        cy
          .get('[data-cy="button--send-mobile-number"]')
          .click()
        cy
          .get('[data-cy="input--otp-number"]')
          .each($input => expect($input.val()).to.be.empty)
        cy
          .get('[data-cy="view--otp-verification"]')
          .should('be.visible')
        cy
          .get('[data-cy="snack-bar--otp-provider"]')
          .should('be.visible')
      },
      /**
             * ==========================================
             * CASE: user never enter OTP in limit of time
             * ==========================================
             * There're several conditions can result in this case:
             *
             * if the phone number user just sent haven't been registered, and
             * he never type valid OTP in 10 sec after app switch him
             * to OTP-verification view due to
             *
             * ❶ server or client had network issue -> didn't get or get that after 10 sec
             * ❷ user type that after 10 sec
             * ❸ the api end point is incorrect
             * ❹ a bug happened in server side
             * ❺ ...
             *
             * Below suppose the condition is ❶ :
             */
      edge_case: () => {
        cy.server()
        cy
          .route({
            method: 'GET',
            url: '/otp*',
            response: ['7283'],
            delay: 6000
          })
          .as('getOTP')

        cy.get('[data-cy="button--send-mobile-number"]').click()
        // cy
        //     .wait('@getOTP', {timeout: 1000}).then(xhr => {
        //         expect(xhr.response.body).to.have.lengthOf(0);
        //     })
        cy
          .get('[data-cy="input--otp-number"]')
          .each($input => expect($input.val()).to.be.empty)
        cy
          .get('[data-cy="view--otp-verification"]')
          .should('be.visible')
        cy
          .get('[data-cy="snack-bar--otp-provider"]')
          .should('not.be.visible')
      }
    }
  },

  focus_on_input_of_mobile_number (index) {
    return cy
      .get('[data-cy="input--mobile-number"]')
      .eq(index)
  },

  focus_on_input_of_otp_number (index) {
    return cy
      .get('[data-cy="input--otp-number"]')
      .eq(index)
  },

  remove_it_after_enter_a_number_into_1st_input () {
    return {
      of: inputName => {
        const fakeOtpNumber = [0, 3, 2, 0]
        this
          [`focus_on_input_of_${inputName}_number`](0)
          .type(fakeOtpNumber[0])
          .focus()
          .clear()
        this
          [`focus_on_input_of_${inputName}_number`](1)
          .then($secondInput => {
            expect($secondInput.is(':focus')).to.be.false
          })
      }
    }
  }
}
