import { resetServerContext } from '@react-forked/dnd'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    resetServerContext()
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="scroll-smooth">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
