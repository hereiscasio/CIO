import {
	remove_data_of_test_user_in_rtdb, perform_clock_in, perform_clock_out
}
from '../../support/clock_page.utils.js';

import { head_to_clock_in_page } from '../../support/general.utils.js';

describe('Page: Clock', () =>
{
	before(() => {
		head_to_clock_in_page();
		remove_data_of_test_user_in_rtdb();
	});

	it('can perform clock-in & clock-out', () =>
	{
		perform_clock_in();
		perform_clock_out();
	});
});

