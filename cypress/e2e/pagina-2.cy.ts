describe('Página 2', () => {
  it('should render the server-fetched users list', () => {
    cy.visit('/pagina-2')
    cy.contains('h2', /server fetch/i).should('be.visible')
    // 3 usuários renderizados pelo server
    cy.get('section').first().find('li').should('have.length', 3)
  })

  it('should render the client-fetched todos list with mocked API', () => {
    // intercepta o fetch do client
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos*', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Mocked TODO 1', completed: false },
        { id: 2, title: 'Mocked TODO 2', completed: true }
      ]
    }).as('getTodos')

    cy.visit('/pagina-2')

    // antes do JS resolver, vê "Carregando..."
    cy.contains(/carregando/i).should('be.visible')

    cy.wait('@getTodos')

    cy.contains('Mocked TODO 1').should('be.visible')
    cy.contains('Mocked TODO 2').should('be.visible')
  })

  it('should show error when client fetch fails', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos*', {
      statusCode: 500,
      body: {}
    })

    cy.visit('/pagina-2')

    cy.contains(/erro:/i).should('be.visible')
  })

  it('should navigate back to home', () => {
    cy.visit('/pagina-2')
    cy.contains('a', /voltar para home/i).click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })
})
