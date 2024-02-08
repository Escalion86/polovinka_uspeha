import Document, { Head, Html, Main, NextScript } from 'next/document'

const { NODE_ENV } = process.env
const isProdMode = NODE_ENV === 'production'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="scroll-smooth">
        <Head>
          <meta
            name="application-name"
            content='Приложение "Половинка успеха"'
          />
          <meta name="theme-color" content="#7a5151" />
          <meta name="mobile-web-app-capable" content="yes" />
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
          <link rel="apple-touch-icon" href="/icon-512x512.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {isProdMode ? (
            <>
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
           
              ym(93417188, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true
              });`,
                }}
              ></script>
              <noscript>
                <div>
                  <img
                    src="https://mc.yandex.ru/watch/93417188"
                    style={{ position: 'absolute', left: -9999 }}
                    alt=""
                  />
                </div>
              </noscript>
            </>
          ) : null}
        </body>
      </Html>
    )
  }
}

export default MyDocument
