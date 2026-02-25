import getPublicCitiesCatalog from '@server/getPublicCitiesCatalog'
import { getSiteUrl } from '@server/seo'

export default async function sitemap() {
  const siteUrl = getSiteUrl()
  const cities = await getPublicCitiesCatalog()
  const now = new Date()

  const base = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  const cityPages = (Array.isArray(cities) ? cities : []).flatMap((city) => {
    const slug = String(city?.slug || '').trim()
    if (!slug) return []

    return [
      {
        url: `${siteUrl}/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${slug}/events`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${siteUrl}/${slug}/login`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${siteUrl}/${slug}/register`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ]
  })

  return [...base, ...cityPages]
}

