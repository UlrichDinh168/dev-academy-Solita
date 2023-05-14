/// <reference types="cypress" />

describe('JOURNEY PAGE', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  context('Render content correctly before any acts', () => {

    it('Should display title', () => {
      cy.get('.journey-wrapper h2').should('have.text', 'Journey lookup')
    })

    it('Should render search inputs, search button', () => {
      cy.get('.search-area').within(() => {
        cy.get(`[data-cy = "input-value"]`).should('exist');
        cy.get(`[data-cy = "input-value"]`).should('have.length', 2)
        cy.contains('Search').should('exist')
      })
    })

    it('Should render "No Data" text ', () => {
      cy.get('.journey-content__right').within(() => {
        cy.contains('No data').should('exist')
      })
    })

    it('Should search button NOT clickable', () => {
      cy.get('[data-cy="search-button"]').should('be.disabled')
    })
  })


  // /**
  //  * Define Cypress Command to set search bars' values
  //  */
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

  // /**
  //  * Add click button action to start searching
  //  */
  Cypress.Commands.add('fetchJourney', (departure, destination) => {
    cy.fillSearchbars(departure, destination)
    cy.get(`[data-cy="search-button"]`).click();
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

  context('Search button', () => {

    it('Displays Clickable search button when both inputs are filled', () => {
      cy.fillSearchbars('Kamppi', 'Pasila railway station')
      cy.get('[data-cy="search-button"]').should('be.enabled').click();
    })
  })

  context('After journeys fetched', () => {
    beforeEach(() => {
      cy.fetchJourney('Kamppi', 'Pasila railway station');
      cy.wait(2000); // wait for any necessary page transitions or API requests to complete
    });


    it('Displays Table and Slider after form submission', () => {
      cy.get('.journey-table-container').should('exist')
      cy.get('.slider-container').should('exist')
    })


    it('Should sort table by Duration when first load', () => {
      cy.get('[data-cy="table-body"]').find('tr').first().within(() => {
        cy.get('td').eq(2).should('contain', '17')
      })
    })

    it('Should sort table when click HEADER', () => {
      cy.get('[data-cy="table-header"]').find('tr').first().within(() => {
        cy.get('th').eq(3).click() // first click to focus the element, second click to sort
      })
      cy.get('[data-cy="table-body"]').find('tr').first().within(() => {
        cy.get('td').eq(2).should('contain', '27')
      })
      cy.get('[data-cy="table-body"]').find('tr').last().within(() => {
        cy.get('td').eq(2).should('contain', '17')
      })
    })

    it('Should drag the slider to the FURTHEST LEFT position and return only ONE VALUE', () => {
      cy.get('.slider').within(() => {
        // Get the Material UI Slider element of 1st slider and move the toggle <span> to the leftest
        cy.get('[data-cy="slider"]').first().find('.MuiSlider-thumb')
          .trigger('mouseup', { force: true }).then($slider => {
            cy.wrap($slider)
              .trigger('mousedown', { button: 0 })
              .trigger('mousemove', { clientX: 0, clientY: 0 })
              .trigger('mouseup', { force: true });
          });

        // Get the Material UI Slider element of 2nd slider and move the toggle <span> to the leftest
        cy.get('[data-cy="slider"]').last().find('.MuiSlider-thumb')
          .trigger('mouseup', { force: true }).then($slider => {
            cy.wrap($slider)
              .trigger('mousedown', { button: 0 })
              .trigger('mousemove', { clientX: 0, clientY: 0 })
              .trigger('mouseup', { force: true });
          });
      })
      cy.get('[data-cy="table-body"]').find('tr').should('have.length', 1)
    });

    it('Should render correct amount of joureys', () => {
      cy.get('[data-cy="pagination"]').should('contain', 10)

    })

    it('Should render correct amount of joureys after another batch', () => {
      cy.get('.load-more').click()
      cy.wait(1000)

      cy.get('.journey-last').should('contain', 2)

      cy.get('[data-cy="pagination"]').should('contain', 20)

    })

  })

  context('No Journey Found', () => {

    beforeEach(() => {
      cy.fetchJourney('Majurinkulma', 'Desiro');
      cy.wait(500); // wait for any necessary page transitions or API requests to complete
    });

    it('Display Error Notification when no journey found', () => {
      cy.get('.journey-content__right').within(() => {
        cy.contains('No data').should('exist')
      })

      cy.get('[data-cy="notification"]').should('exist')
    })
  })
})
