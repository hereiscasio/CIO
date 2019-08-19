/// <reference types="Cypress" />
import {generateRandomIntegerBetween} from '../support/spec-helper/registration.h1';
import h1 from '../support/spec-helper/registration.h1';
//
// User story:
// As a unregistered user,
// i would like to enter my mobile number to receive OTP
//


describe('registration', () => {
	context('take user to next input field', function() {
		beforeEach(() => {
			h1
				.access_app_home_page();
		});
		it('only take me to next mobile-number-input if execute a valid action', function()
		{
			h1
				.entered_invalid_amount_of_characters_into_certain_input_of_mobile_number();
			h1
				.access_app_home_page();
			h1
				.entered_non_numeric_into_certain_input_of_mobile_number();
			h1
				.access_app_home_page();
			h1
				.remove_it_after_enter_a_number_into_1st_input().of('mobile');
		});

		/**
		 * TODO: if first time registration, should not show any previous otp
		 */
		it('only take me to next otp-number-input if execute a valid action', function()
		{
			h1
				.enter_valid_mobile_number_into_each_input_in_order();
			h1
				.click_to_send_my_mobile_number_for_registration()
				.happy_path();
			h1
				.enter_non_numeric_character_into_otp_input_field();
			h1
				.remove_it_after_enter_a_number_into_1st_input().of('otp');
		})
	});

	/**
	 * Tricky cases
	 * ☀️ Experiment pattern of cypress files/code organization
	 * - function naming still respect "user interaction"
	 * - but just because we follow rule above, it's possible
	 *   that we can't understand meaning of some tests except that u look into test details
	 *   (i.e. go to helper file)
	 * so we try to give explanation of a group of testing in main testing file like below
	 */
	context('below tests should ran together', function() {
		it(`should preserve typed phone number once back to
			app home page from otp-verification page`, function()
		{
			h1
				.access_app_home_page();
			h1
				.enter_valid_mobile_number_into_each_input_in_order();
			h1
				.click_on_first_input_of_mobile_number_again();
			h1
				.click_to_send_my_mobile_number_for_registration()
				.happy_path();
			h1
				.back_to_app_home_page();
		});
		it(`will not receive otp again if he try to send the sent mobile number`, function() {
			h1
				.click_to_send_my_mobile_number_again();
		});
	});

	it(`If user just sent the phone number which haven't registered before,
		he will see the OTP present only his device receive OTP,
		no matter how long it could be`, function()
	{
		h1
			.access_app_home_page();
		h1
			.enter_valid_mobile_number_into_each_input_in_order();
		h1
			.click_to_send_my_mobile_number_for_registration()
			.edge_case();
	});

	context('User can request to resend OTP by either below cases: ', function()
	{
		before(() => {
			h1.generateRandomMobileNumber();
		});

		beforeEach(() => {
			h1
				.access_app_home_page();
			h1
				.enter_valid_mobile_number_into_each_input_in_order();
			h1
				.click_to_send_my_mobile_number_for_registration()
				.happy_path();
		});

		it(`should help user request newest OTP if he change
			the phone number which have not registered before`, function()
		{
			h1
				.back_to_app_home_page();
			h1
				.enter_valid_mobile_number_into_each_input_in_order(this.randomMobileNumber);
			h1
				.click_to_send_my_mobile_number_for_registration()
				.happy_path();
		});
		it.only(`User can request newest OTP by clicking button in OTP-verification view every 30 sec`, function()
		{
			cy
				.get("[data-cy='button--resend-otp-by-diy']")
				.should('have.attr', "disabled");
			cy
				.wait(3000);
			cy
				.get("[data-cy='button--resend-otp-by-diy']")
				.should('not.have.attr', "disabled");
		});

	});
	it.skip('should guide me to otp-verification view after i send my mobile number', function()
	{
		// TODO: only show button--send-mobile-number if enter the right thing
		// TODO: can not click "button--send-mobile-number" if enter registered number
		// TODO: should see helper message if enter non-numeric
		// TODO: when focus on first-mobile-input again, do not remove its content if there's stuff existed already
		// TODO:
		// and once go back to previous view,
		// click send-button will only navigate user to next view
		// without send number to server again except user change that number
		// TODO: user can not send other number during certain processing/period
		// h1
		// 	.enter_valid_OTP();
	});

});
