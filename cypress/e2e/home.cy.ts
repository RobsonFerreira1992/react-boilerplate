describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render the heading', () => {
    cy.findByRole('heading', { name: /home \(server component\)/i }).should(
      'be.visible'
    )
  })

  it('should render at least one post (server-side rendered)', () => {
    // os posts vêm renderizados no HTML (SSR), nada de "loading"
    cy.get('main ul li').should('have.length.at.least', 1)
  })

  it('should navigate to página 2', () => {
    cy.contains('a', /ir para página 2/i).click()
    cy.url().should('include', '/pagina-2')
    cy.findByRole('heading', { name: /^página 2$/i }).should('be.visible')
  })
})
