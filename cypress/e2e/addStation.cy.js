/// <reference types="cypress" />

describe('ADD STATION PAGE', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/add-station')
    cy.wait(1000)
  })

  context('Should render layout correctly before any acts', () => {

    it('Should display Title', () => {
      cy.get('.add-station h2').should('have.text', 'Add Station')
    })

    it('Should render search inputs and Add button', () => {
      cy.get('.wrapper-left').within(() => {
        cy.get(`[data-cy = "input-value"]`).should('exist');
        cy.get(`[data-cy = "input-value"]`).should('have.length', 4)
        cy.contains('Add Station').should('exist')

      })
    })

    it('Should Add Station button NOT clickable', () => {
      cy.get('[data-cy="search-button"]').should('be.disabled')
    })


    it('Should have Map component', () => {
      cy.get('.leaflet-container').should('exist')
    })

    it('Should have Marker', () => {
      cy.get('.leaflet-marker-icon').should('be.visible');
    })
  })


  context('Search value in Input field', () => {

    it('Should display search values only when have 3 or more characters', () => {
      cy.get('.search-area').within(() => {
        cy.intercept('POST', '/api/address-search').as('searchResults')
        cy.get(`[data-cy="input-value"]`)
          .type('Majuri')
        cy.wait('@searchResults')
        cy.get('.result__list').should('exist')

      })
    })
  })


  Cypress.Commands.add('fillSearchbars', (place) => {
    cy.get('.search-area').within(() => {
      cy.intercept('POST', '/api/address-search').as('searchResults')
      cy.get(`[data-cy="input-value"]`)
        .first()
        .type(place)
      cy.wait('@searchResults')
      cy.get('.result__list').should('contain', place)
        .find('li')
        .first()
        .click()
    })

  })

  context('Add Station', () => {

    it('should display Success message when station created', () => {
      cy.intercept('POST', '/api/station/add', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Station created successfully'
        }
      }).as('createStation')

      cy.fillSearchbars('Kilo');
      cy.get('[data-cy="search-button"]').click();

      cy.wait('@createStation')

      cy.get('[data-cy="notification"]').should('contain', 'Station created successfully')
    })

    it('should display Fail message when station already existed', () => {

      cy.fillSearchbars('Kamppi');
      cy.get('[data-cy="search-button"]').click();

      cy.get('[data-cy="notification"]').should('contain', 'Station is already taken')
    })
  })
})