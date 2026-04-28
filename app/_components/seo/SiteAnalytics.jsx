import Script from 'next/script'
import PropTypes from 'prop-types'
import { Suspense } from 'react'
import AnalyticsPageViews from './AnalyticsPageViews'

const isProduction = process.env.NODE_ENV === 'production'

const normalizeYandexId = (value) => {
  const id = String(value || '').trim()
  return /^\d+$/.test(id) ? id : ''
}

const normalizeGoogleId = (value) => {
  const id = String(value || '').trim()
  return /^[a-z0-9-]+$/i.test(id) ? id : ''
}

export default function SiteAnalytics({
  googleAnalyticsId = '',
  yandexMetrikaId = '',
  yandexWebvisorEnabled = false,
}) {
  const gaId = normalizeGoogleId(googleAnalyticsId)
  const ymId = normalizeYandexId(yandexMetrikaId)

  if (!isProduction || (!gaId && !ymId)) return null

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}

      {ymId ? (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
              ym(${ymId}, 'init', {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: ${Boolean(yandexWebvisorEnabled)}
              });
            `}
          </Script>
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${ymId}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}

      <Suspense fallback={null}>
        <AnalyticsPageViews
          googleAnalyticsId={gaId}
          yandexMetrikaId={ymId}
        />
      </Suspense>
    </>
  )
}

SiteAnalytics.propTypes = {
  googleAnalyticsId: PropTypes.string,
  yandexMetrikaId: PropTypes.string,
  yandexWebvisorEnabled: PropTypes.bool,
}
