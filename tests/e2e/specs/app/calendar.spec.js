import {
	add_records_in_rtdb,
	head_to_history_dashboard,
	remove_data_of_test_user_in_rtdb,
	record_shown_in_this_month,
	switch_to_next_month,
	record_shown_in_next_month
}
from '../../support/calendar.utils.js';

import { head_to_clock_in_page } from '../../support/general.utils.js';

describe('Page: Calendar', () =>
{
	before(() =>
	{
		head_to_clock_in_page();

		remove_data_of_test_user_in_rtdb();

		add_records_in_rtdb();

		head_to_history_dashboard();
	});

	it ('should show record in different month', () =>
	{
		record_shown_in_this_month();

		switch_to_next_month();

		record_shown_in_next_month();
	});

});