import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl">404 Not Found</h1>
      <p>
        <Link href="/" className="text-blue-500 underline">
          Go home
        </Link>
      </p>
    </main>
  )
}