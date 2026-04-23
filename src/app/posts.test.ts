import { getPosts } from './posts'

describe('getPosts()', () => {
  const mockPosts = [
    { id: 1, title: 'Post 1', body: 'Body 1' },
    { id: 2, title: 'Post 2', body: 'Body 2' }
  ]

  beforeEach(() => {
    // mocka fetch global (jsdom não tem)
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return posts on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts
    })

    const posts = await getPosts()

    expect(posts).toEqual(mockPosts)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts',
      expect.objectContaining({ next: { revalidate: 60 } })
    )
  })

  it('should throw on http error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    })

    await expect(getPosts()).rejects.toThrow('Failed to fetch posts')
  })
})
