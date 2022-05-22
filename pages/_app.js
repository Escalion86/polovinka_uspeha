// import 'tailwindcss/tailwind.css'
import '../styles/fonts/FuturaPT.css'
import '../styles/global.css'
import '../styles/burger.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-image-gallery/styles/css/image-gallery.css'

import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { CloudinaryContext } from 'cloudinary-react'
import Script from 'next/script'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'

// import { createStore, applyMiddleware, compose } from 'redux'
// import thunk from 'redux-thunk'
// import { Provider } from 'react-redux'

// import allReducers from 'state/reducers'

// const composeEnhancers =
//   (typeof window !== 'undefined' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose

// const enhancer = composeEnhancers(applyMiddleware(thunk))

// const store = createStore(allReducers, enhancer)

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@tailwindcss/custom-forms@0.2.1/dist/custom-forms.css"
          rel="stylesheet"
        />
        <Script
          strategy="afterInteractive"
          src="https://cdn.jsdelivr.net/npm/@thelevicole/youtube-to-html5-loader@4.0.1/dist/YouTubeToHtml5.min.js"
        />
        <Script strategy="afterInteractive">{`new YouTubeToHtml5()`}</Script>
        {/* <script src="https://smtpjs.com/v3/smtp.js"></script> */}
      </Head>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        {/* <Provider store={store}> */}
        <CloudinaryContext cloudName="escalion-ru">
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </CloudinaryContext>
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
