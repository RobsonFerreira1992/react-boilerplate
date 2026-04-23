import { render, screen } from '@testing-library/react'

import Main from '.'

describe('<Main />', () => {
  it('should render the heading', () => {
    render(<Main />)

    expect(
      screen.getByRole('heading', { name: /react avançado/i })
    ).toBeInTheDocument()
  })

  it('should render with custom title and description', () => {
    render(<Main title="Hello" description="World" />)

    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /world/i })).toBeInTheDocument()
  })
})
