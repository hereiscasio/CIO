import {
	head_to_history_dashboard,
	add_records_in_rtdb,
	remove_data_of_test_user_in_rtdb,
	head_to_table_view,
	info_shown_in_this_month,
	switch_to_next_month,
	info_shown_in_next_month,
	switch_to_end_of_this_year,
	show_proper_info_in_Dec,
	show_proper_info_in_Jan,
	switch_to_Jan,
	switch_to_Dec
}
from '../../support/table.utils.js';

import { head_to_clock_in_page } from '../../support/general.utils.js';


describe('Page: Table', () =>
{
	before(() =>
	{
		head_to_clock_in_page();

		remove_data_of_test_user_in_rtdb();

		add_records_in_rtdb();

		head_to_history_dashboard();

		head_to_table_view();
	})

	it('should show record in different month', () =>
	{
		cy
			.get('[data-cy=history-table]')
			.within(() =>
			{
				info_shown_in_this_month();

				switch_to_next_month();

				info_shown_in_next_month();
			})
	});

	describe('should show proper info when switching between years', () =>
	{
		before(() =>
		{
			switch_to_end_of_this_year();
		});

		it('switch between Dec and Jan', () =>
		{
			switch_to_Jan();

			show_proper_info_in_Jan();

			switch_to_Dec();

			show_proper_info_in_Dec();
		})
	})
});