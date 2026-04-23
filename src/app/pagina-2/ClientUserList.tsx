'use client'

import { useEffect, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

export default function ClientUserList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((r) => {
        if (!r.ok) throw new Error('Erro HTTP')
        return r.json() as Promise<Todo[]>
      })
      .then((data) => {
        if (active) setTodos(data)
      })
      .catch((e: Error) => {
        if (active) setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="text-gray-400">Carregando...</p>
  if (error) return <p className="text-red-400">Erro: {error}</p>

  return (
    <ul className="space-y-2">
      {todos.map((t) => (
        <li
          key={t.id}
          className="flex items-center gap-2 rounded bg-gray-800 p-3"
        >
          <input type="checkbox" checked={t.completed} readOnly />
          <span>{t.title}</span>
        </li>
      ))}
    </ul>
  )
}
