import format from 'date-fns/format';

const UID = `users/${Cypress.env('TEST_UID')}`

export const remove_data_of_test_user_in_rtdb = function ()
{
	// const today = {
	// 	date: format(Date.now(), 'yyyy-LL-dd'),
	// 	monthWithYear: format(Date.now(), 'yyyy-LL')
	// };
	cy
		.callRtdb(
			'set',
			UID,
			null
		);
};

export const perform_clock_in = function ()
{
	cy
		.findByText('CLOCK IN')
		.click();
	cy
		.findByText('Clock-In', {exact: false})
	cy
		.findByText('CLOCK IN')
		.should('not.visible');
};

export const perform_clock_out = function ()
{
	cy
		.findByText('CLOCK OUT')
		.click();
	cy
		.findAllByText(format(Date.now(), 'kk:mm'));
	cy
		.findByText('CLOCK OUT')
		.should('not.visible');
};