import Link from 'next/link'
import ClientUserList from './ClientUserList'

type User = {
  id: number
  name: string
  email: string
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store' // sempre buscar novo (SSR puro, sem cache)
  })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

// Server Component (default)
export default async function Pagina2() {
  const users = await getUsers()

  return (
    <main className="mx-auto max-w-3xl p-8 text-white">
      <Link href="/" className="text-pink-400 hover:underline">
        ← Voltar para Home
      </Link>

      <h1 className="mt-4 mb-2 text-4xl font-semibold">Página 2</h1>

      <section className="mt-6">
        <h2 className="mb-2 text-2xl font-semibold">
          Server fetch (SSR, no servidor)
        </h2>
        <p className="mb-4 text-gray-300">
          Esta lista foi buscada no servidor. Veja o &ldquo;view source&rdquo;
          do browser — os dados já vêm no HTML.
        </p>
        <ul className="space-y-2">
          {users.slice(0, 3).map((u) => (
            <li key={u.id} className="rounded bg-gray-800 p-3">
              <strong>{u.name}</strong> — <span>{u.email}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-2 text-2xl font-semibold">
          Client fetch (no browser)
        </h2>
        <p className="mb-4 text-gray-300">
          Esta lista é buscada depois que o JS hidrata na página. Aparece
          &ldquo;Carregando...&rdquo; antes dos dados.
        </p>
        <ClientUserList />
      </section>
    </main>
  )
}
