import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@server/authOptions'

export default async function LocationCabinetIndexPage({ params, searchParams }) {
  const session = await getServerSession(authOptions)
  const { location } = params

  if (!location) {
    redirect('/')
  }

  if (!session) {
    const target = new URLSearchParams()
    const page = searchParams?.page
    if (page) {
      target.set('page', page)
    }
    const query = target.toString()
    redirect(`/${location}/login${query ? `?${query}` : ''}`)
  }

  redirect(`/${location}/cabinet/events`)
}
