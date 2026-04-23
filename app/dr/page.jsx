import fs from 'node:fs/promises'
import path from 'node:path'
import DrGalleryClient from './DrGalleryClient'

export const metadata = {
  title: 'DR',
  robots: {
    index: false,
    follow: false,
  },
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'])

async function getDrImages() {
  const publicDrDir = path.join(process.cwd(), 'public', 'dr')

  try {
    const files = await fs.readdir(publicDrDir)

    return files
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' }))
      .map((fileName) => `/dr/${encodeURIComponent(fileName)}`)
  } catch {
    return []
  }
}

export default async function DrPage() {
  const imagePaths = await getDrImages()

  return <DrGalleryClient imagePaths={imagePaths} />
}
