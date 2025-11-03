import localFont from 'next/font/local'
import Providers from './providers'

import '../styles/global.css'
import '../styles/burger.css'
import '../styles/fonts/Lora.css'
import '../styles/fonts/AdleryPro.css'
import '../styles/fonts/Enchants.css'
import '../styles/fonts/FuturaPT.css'
import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-latex-next/node_modules/katex/dist/katex.min.css'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'

export const metadata = {
  title: {
    default: 'Центр серьёзных знакомств - «Половинка успеха»',
    template: '%s | Половинка успеха',
  },
  description:
    'Половинка успеха - проект, созданный для тех, кто ищет серьёзные знакомства и живые встречи.',
  applicationName: 'Приложение «Половинка успеха»',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-512x512.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport = {
  themeColor: '#7a5151',
}

const futura = localFont({
  src: [
    {
      path: '../styles/fonts/FuturaPT-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../styles/fonts/FuturaPT-LightObl.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../styles/fonts/FuturaPT-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/fonts/FuturaPT-MediumObl.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../styles/fonts/FuturaPT-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/FuturaPT-BoldObl.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../styles/fonts/FuturaPT-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../styles/fonts/FuturaPT-HeavyObl.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-futura',
  preload: true,
})

const futuraDemi = localFont({
  src: [
    {
      path: '../styles/fonts/FuturaPT-DemiObl.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../styles/fonts/FuturaPT-Demi.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-futuraDemi',
  preload: true,
})

const adlery = localFont({
  src: [
    {
      path: '../styles/fonts/AdleryProBlockletter.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-adlery',
  preload: true,
})

const adleryProSwash = localFont({
  src: [
    {
      path: '../styles/fonts/AdleryProSwash.woff',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-adleryProSwash',
  preload: true,
})

const lora = localFont({
  src: [
    {
      path: '../styles/fonts/Lora.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/Lora-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-lora',
  preload: true,
})

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        className={`${lora.variable} ${adlery.variable} ${adleryProSwash.variable} ${futura.variable} ${futuraDemi.variable} font-futura`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
