import RootPageClient from './_components/root/RootPageClient'
import getPublicCitiesCatalog from '@server/getPublicCitiesCatalog'
import getGlobalAboutSpaceCards from '@server/getGlobalAboutSpaceCards'
import { getSiteUrl } from '@server/seo'

export const revalidate = 300

const siteUrl = getSiteUrl()

export const metadata = {
  title: 'Половинка успеха',
  description:
    'Платформа живых знакомств и офлайн-встреч для людей 30-50. Выберите город и присоединяйтесь к мероприятиям.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Половинка успеха',
    description:
      'Живые встречи, новые связи и легкая атмосфера общения в вашем городе.',
    siteName: 'Половинка успеха',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Половинка успеха',
    description:
      'Выберите город и откройте пространство живых офлайн-встреч.',
  },
}

export default async function RootPage() {
  const [initialCities, initialAboutSpaceCards] = await Promise.all([
    getPublicCitiesCatalog(),
    getGlobalAboutSpaceCards(),
  ])

  return (
    <RootPageClient
      initialCities={initialCities}
      initialAboutSpaceCards={initialAboutSpaceCards}
    />
  )
}

