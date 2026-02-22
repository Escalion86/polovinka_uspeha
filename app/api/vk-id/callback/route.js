export async function GET() {
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>VK ID Callback</title>
      </head>
      <body>
        <script>
          window.close();
        </script>
      </body>
    </html>
  `

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
