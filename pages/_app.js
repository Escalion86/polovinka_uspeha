import LoadingSpinner from '@components/LoadingSpinner'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { renderTimeViewClock } from '@mui/x-date-pickers'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import Script from 'next/script'
import { SnackbarProvider } from 'notistack'
import 'quill-emoji/dist/quill-emoji.css'
import { Suspense, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css'
import { RecoilEnv, RecoilRoot, useSetRecoilState } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import '../styles/burger.css'
import '../styles/fonts/AdleryPro.css'
import '../styles/fonts/Enchants.css'
import '../styles/fonts/Frankinity.css'
import '../styles/fonts/FuturaPT.css'
import '../styles/global.css'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import isPWAAtom from '@state/atoms/isPWAAtom'

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

// Create a theme instance.
const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: '',
  },
  palette: {
    primary: {
      main: '#7a5151',
    },
    general: {
      main: '#7a5151',
    },
    secondary: {
      main: '#2A323B',
    },
    error: {
      main: '#ff1744',
    },
    red: { main: '#f87171' },
    blue: { main: '#60a5fa' },
    green: { main: '#4ade80' },
    gray: { main: '#9ca3af' },
    yellow: { main: '#FEE100' },
    orange: { main: '#fb923c' },
    purple: { main: '#c084fc' },
    // background: {
    //   default: '#FFD600',
    // },
  },
  root: {
    // height: '-webkit-fill-available',
    // margin: 0,
    // paddingLeft: 30,
    background: 'rgba(239, 243, 246, 1)',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiDesktopTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
    MuiDesktopDateTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
  },
})

const PWAChecker = ({ children }) => {
  const setIsPWA = useSetRecoilState(isPWAAtom)

  useEffect(() => {
    window
      .matchMedia('(display-mode: standalone)')
      .addEventListener('change', ({ matches }) => setIsPWA(matches))
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches)
    // setInterval(() => {
    //   const test = window.matchMedia('(display-mode: standalone)').matches
    //   console.log('test :>> ', test)
    // }, 1000)
  }, [])

  return children
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [])

  useEffect(() => {
    import('preline')
    // var referrer_url = document?.referrer
    // console.log(referrer_url) // вот ваша строка
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        {/* <Script
          strategy="afterInteractive"
          src="https://cdn.jsdelivr.net/npm/@thelevicole/youtube-to-html5-loader@4.0.1/dist/YouTubeToHtml5.min.js"
        /> */}
        {/* <Script strategy="afterInteractive">{`new YouTubeToHtml5()`}</Script> */}
        {/* <script src="https://smtpjs.com/v3/smtp.js"></script> */}
      </Head>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        {/* <Provider store={store}> */}
        <RecoilRoot>
          <RecoilNexus />
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={4}>
              <Script
                src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"
                strategy="beforeInteractive"
              />
              {/* <CssBaseline /> */}

              <Suspense
                fallback={
                  <div className="z-10 flex items-center justify-center w-screen h-screen">
                    <LoadingSpinner text="идет загрузка...." />
                  </div>
                }
              >
                <PWAChecker>
                  <Component {...pageProps} />
                </PWAChecker>
              </Suspense>
            </SnackbarProvider>
          </ThemeProvider>
        </RecoilRoot>
        {/* </Provider> */}
      </SessionProvider>
    </>
  )
}

export default MyApp

// export async function getServerSideProps(ctx) {
//   const session = await getSession(ctx)
//   console.log(`session!!`, session)
//   return {
//     props: {
//       session,
//     },
//   }
// }
