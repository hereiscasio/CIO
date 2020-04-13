// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
	cy.visit('localhost:6006/iframe.html?id=dialog--logout-default&viewMode=story')
    cy.contains('.v-card__title.headline', 'ARE YOU SURE ?');
  })
})
