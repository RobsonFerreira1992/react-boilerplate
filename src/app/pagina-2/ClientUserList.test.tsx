import { render, screen, waitFor } from '@testing-library/react'
import ClientUserList from './ClientUserList'

const mockTodos = [
  { id: 1, title: 'Estudar Next 15', completed: false },
  { id: 2, title: 'Aprender Server Components', completed: true }
]

describe('<ClientUserList />', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should show loading state initially', () => {
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})) // never resolves

    render(<ClientUserList />)

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('should render todos after fetch resolves', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos
    })

    render(<ClientUserList />)

    await waitFor(() => {
      expect(screen.getByText(/estudar next 15/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/aprender server components/i)).toBeInTheDocument()
  })

  it('should show error when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    })

    render(<ClientUserList />)

    await waitFor(() => {
      expect(screen.getByText(/erro:/i)).toBeInTheDocument()
    })
  })
})
