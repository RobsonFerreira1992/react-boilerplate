import Link from 'next/link'
import { getPosts } from './posts'

export default async function Home() {
  const posts = await getPosts()
  const top5 = posts.slice(0, 5)

  return (
    <main className="mx-auto max-w-3xl p-8 text-white">
      <h1 className="mb-2 text-4xl font-semibold">Home (Server Component)</h1>
      <p className="mb-6 text-gray-300">
        Os posts abaixo foram buscados no <strong>servidor</strong> antes do
        HTML ser enviado ao browser. Nenhum JS de fetch vai pro cliente.
      </p>

      <Link
        href="/pagina-2"
        className="mb-6 inline-block rounded bg-pink-600 px-4 py-2 hover:bg-pink-700"
      >
        Ir para Página 2 →
      </Link>

      <ul className="space-y-4">
        {top5.map((post) => (
          <li key={post.id} className="rounded bg-gray-800 p-4">
            <h2 className="font-semibold capitalize">{post.title}</h2>
            <p className="text-sm text-gray-300">{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
