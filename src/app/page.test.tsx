import { render, screen } from '@testing-library/react'
import Home from './page'
import * as postsModule from './posts'

// Mocka o módulo inteiro
jest.mock('./posts')

describe('<Home /> (Server Component)', () => {
  beforeEach(() => {
    jest.spyOn(postsModule, 'getPosts').mockResolvedValue([
      { id: 1, title: 'first post', body: 'first body' },
      { id: 2, title: 'second post', body: 'second body' }
    ])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the heading', async () => {
    // Server Component async: chama a função e renderiza o JSX retornado
    render(await Home())

    expect(
      screen.getByRole('heading', { name: /home \(server component\)/i })
    ).toBeInTheDocument()
  })

  it('should render fetched posts', async () => {
    render(await Home())

    expect(
      screen.getByRole('heading', { name: /first post/i })
    ).toBeInTheDocument()
    expect(screen.getByText('first body')).toBeInTheDocument()
  })

  it('should render the link to pagina-2', async () => {
    render(await Home())

    const link = screen.getByRole('link', { name: /ir para página 2/i })
    expect(link).toHaveAttribute('href', '/pagina-2')
  })
})
