import { redirect } from 'next/navigation'

export default async function LocationIndexRedirectPage({ params }) {
  const { location } = await params

  if (!location) {
    redirect('/')
  }

  redirect(`/${location}`)
}
