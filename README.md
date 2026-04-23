# React Avançado — Boilerplate (v2)

Boilerplate moderno para projetos **Next.js 15 (App Router)** com **React 19**, **TypeScript 5**, **Tailwind CSS v4**, testes unitários com **Jest + SWC** e E2E com **Cypress 13**.

> Este boilerplate é opinativo. O objetivo é ter uma base pronta, testada e escalável para novos projetos.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Linguagem | TypeScript 5.6 |
| Estilização | Tailwind CSS v4 |
| Ícones | @styled-icons/* |
| Testes unitários | Jest 29 + @swc/jest + Testing Library 16 |
| Testes E2E | Cypress 13 + @testing-library/cypress |
| Documentação de UI | Storybook 8 (`@storybook/nextjs`) |
| Lint | ESLint 9 (flat config) + Prettier 3 |
| Git hooks | Husky 9 + lint-staged 15 |
| Scaffolding | Plop |
| CI | GitHub Actions |

---

## Requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10

---

## Começando

```bash
# instalar dependências
npm install

# subir servidor de desenvolvimento
npm run dev
# http://localhost:3000
```

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server Next (porta 3000) |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build em produção |
| `npm run lint` | ESLint (falha em qualquer warning) |
| `npm test` | Jest em modo "padrão" |
| `npm run test:watch` | Jest em modo watch |
| `npm run test:ci` | Jest single-run (CI) |
| `npm run cypress:open` | Abre Cypress interativo |
| `npm run cypress:run` | Cypress headless |
| `npm run e2e` | Sobe o dev server + Cypress interativo |
| `npm run e2e:ci` | Sobe o dev server + Cypress headless |
| `npm run storybook` | Storybook em http://localhost:6006 |
| `npm run build-storybook` | Build estático do Storybook |
| `npm run generate` | Scaffolding de componente (Plop) |

---

## Estrutura de pastas

```
.
├── .github/workflows/ci.yml     # pipeline CI (lint + test + build + e2e)
├── .husky/                      # git hooks
├── .jest/                       # setup do Jest (jest-dom, styleMock)
├── .storybook/                  # config do Storybook 8
├── .vscode/settings.json        # preferências do editor (auto-import etc.)
├── cypress/                     # specs E2E + support + tsconfig próprio
│   ├── e2e/*.cy.ts
│   ├── support/{e2e.ts,commands.ts}
│   └── tsconfig.json
├── generators/                  # templates do plop
│   ├── plopfile.js
│   └── templates/{Component,stories,test}.hbs
├── public/                      # assets estáticos (/img, /favicon, etc.)
├── src/
│   ├── app/                     # App Router (páginas, layouts, data fetching)
│   │   ├── layout.tsx           # root layout
│   │   ├── page.tsx             # rota /
│   │   └── <segmento>/page.tsx  # rota /<segmento>
│   ├── components/              # componentes de UI reutilizáveis
│   │   └── <Nome>/{index.tsx,stories.tsx,test.tsx}
│   └── styles/
│       └── globals.css          # Tailwind v4 + @theme
├── cypress.config.ts
├── eslint.config.mjs            # ESLint flat config
├── jest.config.js
├── next.config.js
├── postcss.config.js            # Tailwind v4 via @tailwindcss/postcss
├── tsconfig.json                # paths: "@/*" → "src/*"
└── package.json
```

---

## App Router — Server vs. Client Components

**Regra**: tudo é Server Component por padrão. Só vire Client quando precisar de interatividade.

### Server Component (default)
```tsx
// src/app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.exemplo.com/posts', {
    next: { revalidate: 60 } // ISR
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### Client Component
```tsx
'use client'
import { useState, useEffect } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Cache do `fetch` (Next 15)
| Opção | Comportamento |
|---|---|
| `fetch(url)` | **Não cacheia** (default do Next 15) |
| `fetch(url, { cache: 'force-cache' })` | Cacheia no build |
| `fetch(url, { cache: 'no-store' })` | Nunca cacheia (SSR dinâmico) |
| `fetch(url, { next: { revalidate: 60 } })` | ISR: gera HTML estático e revalida a cada 60s |
| `fetch(url, { next: { tags: ['posts'] } })` | Invalidável via `revalidateTag('posts')` |

### Arquivos especiais por rota
| Arquivo | Função |
|---|---|
| `page.tsx` | A rota |
| `layout.tsx` | Wrapper (estado preservado entre navegações) |
| `loading.tsx` | UI de loading (Suspense automático) |
| `error.tsx` | Fallback de erro (precisa `'use client'`) |
| `not-found.tsx` | 404 customizado |
| `route.ts` | API endpoint (ex.: `/api/foo`) |

### Navegação
```tsx
// Server e Client
import Link from 'next/link'
<Link href="/sobre">Sobre</Link>

// Client Components
'use client'
import { useRouter } from 'next/navigation' // ⚠ NÃO 'next/router'
const router = useRouter()
router.push('/sobre')

// Server Components
import { redirect } from 'next/navigation'
redirect('/login')
```

---

## Estilização — Tailwind CSS v4

A config agora fica no CSS (em vez de `tailwind.config.js`):

```css
/* src/styles/globals.css */
@import 'tailwindcss';

@theme {
  --color-primary: #f231a5;
  --color-main-bg: #06092b;
  --font-sans: Poppins, system-ui, sans-serif;
}
```

Use diretamente em classes: `bg-primary`, `bg-main-bg`, `font-sans`.

### Prettier + Tailwind
`prettier-plugin-tailwindcss` está ativo e ordena classes automaticamente ao salvar.

---

## Testes unitários (Jest)

- Globals do Jest (`describe`, `it`, `expect`) estão habilitados via `tsconfig` (`types: ["jest", ...]`).
- `@testing-library/jest-dom` dá matchers como `toBeInTheDocument`.
- `@swc/jest` transpila (mesmo SWC do Next).
- `coverageProvider: 'v8'` (rápido, sem Babel).

### Padrões

**1. Função pura (data fetching)**
```ts
global.fetch = jest.fn()
;(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => mockData
})
```

**2. Server Component async (React 19)**
```tsx
jest.mock('./posts')
jest.spyOn(postsModule, 'getPosts').mockResolvedValue([...])
render(await Home())        // ⚠ resolva a Promise antes
```

**3. Client Component**
```tsx
render(<Counter />)
await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
```

### Estrutura de testes
- Colocar `test.tsx` ao lado do componente.
- Preferir queries semânticas (`getByRole`, `getByText`) em vez de `getByTestId`.
- Não usar snapshots a menos que haja razão clara.

---

## Testes E2E (Cypress)

- `baseUrl`: `http://localhost:3000`
- Queries semânticas via `@testing-library/cypress` (`cy.findByRole`, etc.)
- `tsconfig` dedicado em `cypress/` (não polui tipos do Jest).

### Padrões

```ts
// cypress/e2e/home.cy.ts
describe('Home', () => {
  it('navigates to /sobre', () => {
    cy.visit('/')
    cy.findByRole('link', { name: /sobre/i }).click()
    cy.url().should('include', '/sobre')
  })

  it('mocks a client-side fetch', () => {
    cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers')
    cy.visit('/users')
    cy.wait('@getUsers')
  })
})
```

### Rodando
```bash
npm run e2e          # sobe dev server + abre UI
npm run e2e:ci       # headless (CI)
```

---

## Scaffolding — Plop

```bash
npm run generate
# ? What is your component name? Button
# gera: src/components/Button/{index.tsx,stories.tsx,test.tsx}
```

Edite templates em `generators/templates/`.

---

## Lint & Format

- **ESLint 9** em flat config (`eslint.config.mjs`)
- **Prettier 3** (`.prettierrc`) com `prettier-plugin-tailwindcss`
- Pre-commit via **Husky 9** + **lint-staged 15**:
  - ESLint com `--fix` em `src/**/*.{ts,tsx}`
  - Jest `--findRelatedTests` (garante que só commita se os testes passam)

---

## CI — GitHub Actions

Workflow em `.github/workflows/ci.yml`. Em cada push/PR para `main`:

1. **lint-and-test**: lint + tsc + testes unitários
2. **build** (depende do 1): build de produção
3. **e2e** (depende do 1): build + start + Cypress headless

Coverage e screenshots são artifacts.

---

## Imports

- Paths configurados no `tsconfig.json`: `@/*` → `src/*`
  ```ts
  import Main from '@/components/Main'
  ```

---

## Adicionando novas rotas

```bash
mkdir -p src/app/nova-rota
```

`src/app/nova-rota/page.tsx`:
```tsx
export default function NovaRota() {
  return <main>Olá</main>
}
```

URL: `/nova-rota`.

---

## Para mais detalhes

Veja o [`AGENTS.md`](./AGENTS.md) — documento canônico com convenções, decisões de arquitetura e padrões de código usados neste boilerplate. Use-o como referência ao criar novos projetos a partir desta base.
