const buildError = (type, message) => ({
  success: false,
  data: {
    error: {
      type,
      message,
    },
  },
})

const isAllowedHost = (hostname) =>
  hostname === 'escalioncloud.ru' || hostname.endsWith('.escalioncloud.ru')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')
    if (!rawUrl) {
      return Response.json(
        buildError('VALIDATION_ERROR', 'Parameter "url" is required'),
        { status: 400 }
      )
    }

    let targetUrl
    try {
      targetUrl = new URL(rawUrl)
    } catch {
      return Response.json(buildError('VALIDATION_ERROR', 'Invalid URL'), {
        status: 400,
      })
    }

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return Response.json(
        buildError('VALIDATION_ERROR', 'Only http/https URLs are allowed'),
        { status: 400 }
      )
    }

    if (!isAllowedHost(targetUrl.hostname)) {
      return Response.json(
        buildError(
          'VALIDATION_ERROR',
          'Only escalioncloud.ru resources are allowed'
        ),
        { status: 400 }
      )
    }

    const upstream = await fetch(targetUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
    })

    if (!upstream.ok) {
      return Response.json(
        buildError(
          'UPSTREAM_ERROR',
          `Failed to fetch image (status ${upstream.status})`
        ),
        { status: upstream.status }
      )
    }

    const contentType =
      upstream.headers.get('content-type') || 'application/octet-stream'
    const buffer = await upstream.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return Response.json(
      buildError('INTERNAL_ERROR', 'Unexpected image proxy error'),
      { status: 500 }
    )
  }
}

