// import 'tailwindcss/tailwind.css'
import '../styles/fonts/FuturaPT.css'
import '../styles/fonts/AdleryPro.css'
import '../styles/global.css'
import '../styles/burger.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import 'react-edit-text/dist/index.css'

import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
// import Script from 'next/script'
import {
  RecoilRoot,
  // atom,
  // selector,
  // useRecoilState,
  // useRecoilValue,
} from 'recoil'

import { ThemeProvider } from '@mui/material/styles'

// import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'

import 'react-image-crop/dist/ReactCrop.css'

import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'
import Script from 'next/script'
import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'
// import { CssBaseline } from '@mui/material/'

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: '',
  },
  palette: {
    primary: {
      main: '#7a5151',
    },
    secondary: {
      main: '#2A323B',
    },
    error: {
      main: red.A400,
    },
    red: { main: '#f87171' },
    blue: { main: '#60a5fa' },
    green: { main: '#4ade80' },
    gray: { main: '#9ca3af' },
    yellow: { main: '#FEE100' },
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
})

// import { createStore, applyMiddleware, compose } from 'redux'
// import thunk from 'redux-thunk'

// import allReducers from 'state/reducers'

// const composeEnhancers =
//   (typeof window !== 'undefined' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose

// const enhancer = composeEnhancers(applyMiddleware(thunk))

// const store = createStore(allReducers, enhancer)

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
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
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={4}>
              <Script
                src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"
                strategy="beforeInteractive"
              />
              {/* <CssBaseline /> */}
              <Component {...pageProps} />
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
