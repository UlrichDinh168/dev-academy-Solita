/// <reference types="cypress" />

describe('STATION PAGE', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/station')
    cy.wait(1000)
  })

  context('Should render layout correctly before any acts', () => {

    it('Should display Title', () => {
      cy.get('.station-container h2').should('have.text', 'Station lookup')
    })

    it('Should render Search inputs', () => {
      cy.get('.input__wrapper').should('exist');
    })

    it('Should render Table', () => {
      cy.get('.journey-table-container').should('exist');
    })

    it('Should sort table by Name when first load', () => {
      cy.get('[data-cy="table-body"]').find('tr').first().should('contain', 'A.I. Virtasen aukio');
    })

  })

  context('Should filter by Name when start typing', () => {

    it('Should sort table when click HEADER', () => {
      cy.get('[data-cy="table-header"]').find('tr').first().within(() => {
        cy.get('th span').eq(0).click() // first click to focus the element, second click to sort
      })

      cy.get('[data-cy="table-body"]').find('tr').first().within(() => {
        cy.get('th').eq(0).should('contain', 'Ympyrätalo')
      })
      cy.get('[data-cy="table-body"]').find('tr').first().within(() => {
        cy.get('td').eq(3).should('contain', '36')
      })
    })

    it('Should contain Value type in', () => {
      cy.get(`[data-cy="input-value"]`)
        .type('Des')

      cy.get('[data-cy="table-body"]').should('contain', 'Design Museum')
    })

    it('Should popup Modal if click the row', () => {
      cy.get('[data-cy="table-row"]').first().click()
      cy.wait(1000)
      cy.get('body').find('[data-cy="modal"]').should('exist');
    })
  })
})