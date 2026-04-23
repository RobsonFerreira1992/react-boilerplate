import Image from 'next/image'

type MainProps = {
  title?: string
  description?: string
}

const Main = ({
  title = 'React Avançado',
  description = 'Typescript, React.js, Next.js e Tailwind CSS'
}: MainProps) => (
  <main className="bg-main-bg flex h-full w-full flex-col items-center justify-center p-12 text-center text-white">
    <Image
      src="/img/logo.svg"
      alt="Imagem de um átomo e React Avançado escrito ao lado"
      width={250}
      height={120}
      className="mb-8"
      priority
    />
    <h1 className="text-4xl font-semibold">{title}</h1>
    <h2 className="text-2xl font-normal">{description}</h2>
    <Image
      src="/img/hero-illustration.svg"
      alt="Um desenvolvedor em frente à tela do código"
      width={300}
      height={300}
      className="mt-12 h-auto w-[min(30rem,100%)]"
    />
  </main>
)

export default Main
