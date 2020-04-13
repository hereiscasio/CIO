describe('Test in Mobile Size', () => {
	before(() => {
		cy.visit('iframe.html?id=clockwidget--not-yet-today-clock-in');
		cy.viewport(320, 568);
	});

	it('should show float menu panel once click menu icon', () =>
	{
		cy
			.get('[data-cy=menu-icon]')
			.click();
		cy
			.findByText('Logout')
		cy
			.findByText('History');
		cy
			.findByText('Settings');
	});
});
