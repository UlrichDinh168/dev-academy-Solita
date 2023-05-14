/// <reference types="cypress" />

describe('ADD JOURNEY PAGE', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/add-journey')
    cy.wait(1000)
  })

  context('Should render layout correctly before any acts', () => {

    it('Should display Title', () => {
      cy.get('.add-journey h2').should('have.text', 'Add Journey')
    })

    it('Should render search inputs and Add button', () => {
      cy.get('.wrapper-left').within(() => {
        cy.get(`[data-cy = "input-value"]`).should('exist');
        cy.get(`[data-cy = "input-value"]`).should('have.length', 4)
        cy.contains('Add Journey').should('exist')

      })
    })

    it('Should Add Journey button NOT clickable', () => {
      cy.get('[data-cy="search-button"]').should('be.disabled')
    })

    it('Should have Map component', () => {
      cy.get('.leaflet-container').should('exist')
    })
  })

  context('Search value in Input field', () => {
    it('Should display search values only when Station exists', () => {
      cy.get('.search-area').within(() => {
        cy.intercept('POST', '/api/station/search').as('searchResults')
        cy.get(`[data-cy="input-value"]`)
          .first()
          .type('Majuri')
        cy.wait('@searchResults')
        cy.get('.result__list').should('exist')

      })
    })

    it('Should NOT display search values when Station doesn not exist', () => {
      cy.get('.search-area').within(() => {
        cy.intercept('POST', '/api/station/search').as('searchResults')
        cy.get(`[data-cy="input-value"]`)
          .first()
          .type('Majurikuta')
        cy.wait('@searchResults')
        cy.get('.result__list').should('not.exist')

      })
    })
  })

  Cypress.Commands.add('fillSearchbars', (departure, destination) => {
    cy.get('.search-area').within(() => {
      cy.intercept('POST', '/api/station/search').as('searchResults')
      cy.get(`[data-cy="input-value"]`)
        .first()
        .type(departure)
      cy.wait('@searchResults')
      cy.get('.result__list').should('contain', departure)
        .find('li')
        .first()
        .click()
    })

    cy.get('.search-area').within(() => {
      cy.intercept('POST', '/api/station/search').as('searchResults')
      cy.get(`[data-cy="input-value"]`)
        .last()
        .type(destination)
      cy.wait('@searchResults')
      cy.get('.result__list').should('contain', destination)
        .find('li')
        .first()
        .click()
    })
  })


  context('Should filter by Name when start typing', () => {
    it('Should return 2 markers on Map', () => {

      cy.fillSearchbars('Kamppi', 'Pasila railway station');

      cy.get('.leaflet-marker-icon').should('be.visible');
      cy.get('.leaflet-marker-icon').should('have.length', 2);
    })

    it('Should Add Journey button ~Clickable', () => {
      cy.fillSearchbars('Kamppi', 'Pasila railway station')
      cy.get('[data-cy="search-button"]').should('be.enabled').click();
    })

    it('Should display Warning message while two locations are the same', () => {
      cy.fillSearchbars('Kamppi', 'Kamppi')
      cy.get('[data-cy="notification"]').should('contain', 'Same location')
    })
  })


  context('Add Journey', () => {

    it('should display Success message when journey created', () => {
      cy.intercept('POST', '/api/journey/add', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Journey created successfully'
        }
      }).as('createJourney')

      cy.fillSearchbars('Kilo', 'Majurinkulma');
      cy.get('[data-cy="search-button"]').click();

      cy.wait('@createJourney')

      cy.get('[data-cy="notification"]').should('contain', 'Journey created successfully')
    })
  })
})