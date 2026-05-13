const ALLOWED_HOSTS = new Set([
  'cloud.escalion.ru',
  'escalioncloud.ru',
  'api.escalioncloud.ru',
  'res.cloudinary.com',
  't.me',
  'localhost',
  '127.0.0.1',
])

const getErrorResponse = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: {
      error: {
        type,
        message,
      },
    },
  })

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return getErrorResponse(
      res,
      405,
      'method_not_allowed',
      'Method not allowed'
    )
  }

  const rawUrl = req.query?.url
  if (!rawUrl || typeof rawUrl !== 'string') {
    return getErrorResponse(
      res,
      400,
      'invalid_request',
      'Query param "url" is required'
    )
  }

  let parsedUrl
  try {
    parsedUrl = new URL(rawUrl)
  } catch {
    return getErrorResponse(res, 400, 'invalid_url', 'Invalid URL')
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return getErrorResponse(
      res,
      400,
      'invalid_protocol',
      'Only http/https protocols are allowed'
    )
  }

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return getErrorResponse(res, 403, 'forbidden_host', 'Host is not allowed')
  }

  try {
    const response = await fetch(parsedUrl.toString())
    if (!response.ok) {
      return getErrorResponse(
        res,
        502,
        'upstream_error',
        `Image request failed with status ${response.status}`
      )
    }

    const contentType = response.headers.get('content-type') || 'image/png'
    if (!contentType.startsWith('image/')) {
      return getErrorResponse(
        res,
        415,
        'unsupported_media_type',
        'Upstream resource is not an image'
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${contentType};base64,${base64}`

    return res.status(200).json({
      success: true,
      data: {
        dataUrl,
      },
    })
  } catch {
    return getErrorResponse(
      res,
      500,
      'internal_error',
      'Failed to convert image to base64'
    )
  }
}
