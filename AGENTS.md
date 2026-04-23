# AGENTS.md

> **Propósito**: documento canônico sobre como este projeto foi estruturado e como **deve** ser mantido/estendido. Sirva como referência ao pedir a um agente de IA (Copilot, ChatGPT, Claude, Cursor, etc.) que crie novos projetos a partir deste boilerplate.
>
> Ao iniciar um novo projeto, cole este arquivo no contexto da IA e peça: *"Crie um novo projeto seguindo as convenções deste AGENTS.md"*.

---

## 1. Identidade do projeto

- **Tipo**: Boilerplate web fullstack-ready (Next.js App Router).
- **Objetivo**: Base opinativa e testada para SPAs/sites com SSR/ISR/SSG, UI com Tailwind, testes unitários e E2E.
- **Filosofia**:
  - Preferir **Server Components** sempre que possível (menos JS no cliente).
  - Testes automatizados de primeira classe (unit + e2e) em todo feature novo.
  - Lint + type-check **quebram o CI**. Código só merge verde.
  - Zero config em CSS: Tailwind v4 via `@theme` no próprio CSS.
  - Sem abstrações prematuras. Extrair quando houver duplicação real (≥ 3 usos).

---

## 2. Stack definitiva (2026-04)

### Runtime
- **Node.js ≥ 20**
- **npm ≥ 10** (não usar yarn ou pnpm neste boilerplate — manter consistência)

### Core
| Lib | Versão | Por quê |
|---|---|---|
| Next.js | ^15.5 | App Router maduro, Server Components |
| React | ^19 | Última stable, suporte a `use()`, actions |
| TypeScript | ^5.6 | target `ES2022`, `moduleResolution: bundler` |

### Styling
| Lib | Versão | Observações |
|---|---|---|
| Tailwind CSS | ^4.0 | Config em CSS via `@theme` |
| `@tailwindcss/postcss` | ^4.0 | Plugin PostCSS oficial |
| `prettier-plugin-tailwindcss` | ^0.6 | Ordena classes |

**Não usar** styled-components, emotion, CSS-in-JS. Em caso de CSS complexo, usar CSS Modules.

### Testes
| Lib | Versão |
|---|---|
| Jest | ^29.7 |
| @swc/jest | ^0.2 |
| @testing-library/react | ^16.0 |
| @testing-library/jest-dom | ^6.6 |
| Cypress | ^13.15 |
| @testing-library/cypress | ^10.0 |
| start-server-and-test | ^2.0 |

### DevEx
| Lib | Versão |
|---|---|
| ESLint | ^9 (flat config) |
| typescript-eslint | ^8 |
| Prettier | ^3 |
| Husky | ^9 |
| lint-staged | ^15 |
| Storybook | ^8 (@storybook/nextjs) |
| Plop | ^4 |

---

## 3. Estrutura obrigatória

```
.
├── .github/workflows/ci.yml
├── .husky/pre-commit
├── .jest/{setup.ts,styleMock.js}
├── .storybook/{main.ts,preview.tsx}
├── .vscode/settings.json
├── cypress/
│   ├── e2e/*.cy.ts
│   ├── support/{e2e.ts,commands.ts}
│   └── tsconfig.json
├── generators/{plopfile.js,templates/}
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── <route>/page.tsx
│   ├── components/<Nome>/{index.tsx,stories.tsx,test.tsx}
│   └── styles/globals.css
├── cypress.config.ts
├── eslint.config.mjs
├── jest.config.js
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

**Não criar**:
- `src/pages/` (App Router only)
- `tailwind.config.js` (usar `@theme` em CSS)
- `.eslintrc.json` (usar `eslint.config.mjs`)
- `babel.config.js` (usar SWC)

---

## 4. Convenções de código

### Nomenclatura
- Componentes: **PascalCase** em pastas (`Button/index.tsx`).
- Hooks: `useAlgumaCoisa.ts`.
- Arquivos utilitários: `kebab-case.ts`.
- Rotas dinâmicas: `[slug]/page.tsx`.
- Rotas opcionais: `[[...slug]]/page.tsx`.

### Componentes
- **Sempre** export default do componente principal.
- Props tipadas via `type` (não `interface`) a menos que precise estender.
- Desestruturação com defaults no parâmetro, não no corpo.
  ```tsx
  type Props = { title?: string }
  const Main = ({ title = 'Hello' }: Props) => <h1>{title}</h1>
  export default Main
  ```
- **Não** usar `React.FC` (não infere children corretamente).
- Server Component por padrão; `'use client'` só quando necessário.

### Server vs. Client
- Server Component: async permitido, sem hooks React, sem eventos.
- Client Component: começa com `'use client'` no topo do arquivo.
- Componente pequeno e interativo → isolar em Client Component separado; manter a page como Server.
- Server Component pode importar Client Component. Inverso **não** é direto — passe via `children`.

### Data fetching
- Fetch em Server Components: `await fetch(...)` direto no componente ou em função separada.
- Fetch em Client Components: `useEffect` + `useState` ou (preferido para listas) React Query / SWR (não incluído por default — adicionar quando necessário).
- Mutations: **Server Actions** (preferido) ou Route Handlers (`src/app/api/*/route.ts`).

### TypeScript
- `strict: true` (não desabilitar).
- Path alias `@/*` → `src/*`.
- Não usar `any`. Em último caso, `unknown` + narrowing.
- Tipos de retorno explícitos em **funções exportadas** e handlers.
- Preferir `satisfies` a casting.

### Estilização
- Tailwind primeiro. Classes inline, sem `className={cn(...)}` helper a menos que precise compor várias.
- Tokens no `@theme` (cores, fontes, espaçamentos).
- Imagens: `next/image` com `width`/`height` ou `fill`.

### Imports
- Absolutos via `@/*`:
  ```ts
  import Button from '@/components/Button'
  ```
- Ordem: externos → internos → relativos.
- Auto-import do VS Code configurado para **excluir** `node:test` (evita colisão com Jest globals).

---

## 5. Padrões de teste

### Arquivos de teste
- Unit: `test.tsx` **ao lado** do componente.
- Testes de funções puras: `<nome>.test.ts` ao lado do módulo.
- E2E: `cypress/e2e/<feature>.cy.ts`.

### O que testar
- **Componente**: que renderiza o papel semântico esperado; comportamentos visíveis ao usuário.
- **Função pura**: inputs felizes + casos de erro.
- **Rota / integração**: via Cypress (E2E), não Jest.

### O que NÃO testar
- Implementação interna (`useState` calls, refs).
- Classes CSS do Tailwind (exceto quando são comportamento crítico — raríssimo).
- Snapshots (evite; usar queries semânticas).

### Cobertura
- Alvo: ≥ 80% em lines, statements e branches para módulos novos.
- CI falha se cobertura cair (adicionar thresholds quando projeto crescer).

### Mocks
- **Server Component async**:
  ```ts
  jest.mock('./data')
  jest.spyOn(mod, 'getThing').mockResolvedValue(...)
  render(await Page())
  ```
- **fetch global**:
  ```ts
  global.fetch = jest.fn()
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => data })
  ```
- **next/navigation** (quando necessário):
  ```ts
  jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams()
  }))
  ```

### Cypress
- Usar `cy.findByRole` / `cy.findByText` (via `@testing-library/cypress`).
- Mockar APIs com `cy.intercept`.
- Não usar `cy.wait(500)` — sempre esperar por elemento ou alias de intercept.

---

## 6. Lint, format e git hooks

- **ESLint 9 flat config** (`eslint.config.mjs`).
- `lint` falha em qualquer warning (`--max-warnings=0`).
- `prettier` via `eslint-plugin-prettier`.
- **pre-commit**: `lint-staged` roda `eslint --fix` + `jest --findRelatedTests` nos arquivos staged.
- Não adicionar `--no-verify` em commits. Se quebrar o hook, corrige.

---

## 7. CI/CD (GitHub Actions)

Workflow `.github/workflows/ci.yml` executa em push/PR para `main`:

1. **lint-and-test**: install + `lint` + `tsc --noEmit` + `test:ci`
2. **build**: (depende do 1) build de produção
3. **e2e**: (depende do 1) `cypress-io/github-action@v6` com build + start + Cypress

Se o projeto tiver deploy (Vercel/Netlify), adicionar job `deploy` dependendo de **todos** os jobs acima.

---

## 8. Adicionando coisas novas

### Nova página
```bash
mkdir -p src/app/minha-rota
# criar page.tsx dentro
```

### Novo componente
```bash
npm run generate
# prompt → nome do componente
```
Gera: `src/components/<Nome>/{index.tsx,stories.tsx,test.tsx}`.

### Nova dependência
1. Verifique se a lib está ativa e compatível com **React 19** e **Next 15**.
2. Prefira libs com tipos nativos (`@types/*` é sinal de abandono).
3. Rode `npm run lint`, `npm test`, `npm run build` para garantir que nada quebrou.

### Rota de API (quando necessário)
```ts
// src/app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true })
}
```

### Server Action (preferido sobre route handlers para mutações)
```tsx
// src/app/form/actions.ts
'use server'
export async function submitForm(formData: FormData) {
  const name = formData.get('name')
  // ... mutação
}

// src/app/form/page.tsx
import { submitForm } from './actions'
export default function FormPage() {
  return (
    <form action={submitForm}>
      <input name="name" />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

---

## 9. Decisões arquiteturais (ADRs resumidos)

| # | Decisão | Motivo |
|---|---|---|
| 1 | **App Router** | Roadmap do Next; Server Components reduzem JS no cliente |
| 2 | **Tailwind v4** | Padrão de estilização hoje; zero runtime; config em CSS |
| 3 | **styled-components removido** | Em modo manutenção, sem suporte a RSC |
| 4 | **SWC em vez de Babel** | Performance; consistência com o Next |
| 5 | **Coverage v8** | Mais rápido, sem depender de Babel |
| 6 | **Flat config ESLint 9** | Futuro do ESLint; `.eslintrc.json` deprecado |
| 7 | **npm, não yarn/pnpm** | Simplicidade; vem com Node |
| 8 | **Cypress, não Playwright** | Já adotado; UI mais amigável para quem vem do Selenium; mudar para Playwright em projetos novos é possível |
| 9 | **Storybook @storybook/nextjs 8** | Único runner oficial compatível com Next 15 |
| 10 | **Jest em vez de Vitest** | Ecossistema maduro; migrar para Vitest se build lento virar gargalo |

---

## 10. Quando criar um novo projeto a partir deste boilerplate

1. **Clonar** este repo com novo nome.
2. Atualizar `name` no `package.json`.
3. Apagar `src/app/pagina-2/` e ajustar `src/app/page.tsx`.
4. Apagar `src/components/Main/` se não for usar.
5. Apagar testes de exemplo que não fazem sentido no novo contexto.
6. Atualizar `README.md` com descrição específica do projeto.
7. **Manter** este `AGENTS.md` como referência das convenções.
8. Commit inicial: `chore: initial commit from react-avancado-boilerplate v2`.

---

## 11. Como pedir ajuda a uma IA (prompt sugerido)

```
Estou começando um projeto baseado no boilerplate descrito no AGENTS.md em anexo.
Tarefa: <descreva>

Restrições obrigatórias:
- Seguir integralmente as convenções do AGENTS.md (estrutura, stack, testes, lint).
- Não introduzir bibliotecas fora da stack definida sem justificativa.
- Toda feature nova deve vir com teste unitário + e2e quando envolver UI/fluxo.
- Preferir Server Component; só usar 'use client' quando estritamente necessário.
```

---

## 12. Mantendo o boilerplate atualizado

- Revisar dependências a cada **3 meses** ou quando Next sair major.
- Atualizar a seção "Stack definitiva" acima com a versão real.
- Documentar cada migração (major bump) em um ADR novo (seção 9).
- Rodar `npm outdated` regularmente.

---

## 13. Checklist antes de cada PR

- [ ] `npm run lint` passa sem warnings
- [ ] `npx tsc --noEmit` passa sem erros
- [ ] `npm test` passa com coverage mantida
- [ ] `npm run e2e:ci` passa (se alterou UI/fluxo)
- [ ] `npm run build` passa
- [ ] README/AGENTS atualizados se houver mudança de padrão

---

**Última revisão**: 2026-04-23 (stack alinhada a Next 15.5 + React 19 + Tailwind 4).
