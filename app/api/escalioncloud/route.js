const ESCALIONCLOUD_API_URL = 'https://api.escalioncloud.ru/api'

const buildError = (type, message) => ({
  success: false,
  data: {
    error: {
      type,
      message,
    },
  },
})

const parseUpstreamResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function POST(request) {
  const password = process.env.ESCALIONCLOUD_PASSWORD
  if (!password) {
    return Response.json(
      buildError(
        'CONFIG_ERROR',
        'ESCALIONCLOUD_PASSWORD is not configured on the server'
      ),
      { status: 500 }
    )
  }

  try {
    const incomingFormData = await request.formData()
    const formData = new FormData()

    for (const [key, value] of incomingFormData.entries()) {
      formData.append(key, value)
    }

    formData.append('password', password)

    const upstreamResponse = await fetch(ESCALIONCLOUD_API_URL, {
      method: 'POST',
      body: formData,
    })
    const upstreamBody = await parseUpstreamResponse(upstreamResponse)
    console.log('EscalionCloud upload response:', {
      status: upstreamResponse.status,
      ok: upstreamResponse.ok,
      contentType: upstreamResponse.headers.get('content-type'),
      body: upstreamBody,
    })

    const upstreamStatus = upstreamBody?.status
    const upstreamMessage = upstreamBody?.message
    const upstreamReason = upstreamBody?.reason
    const isUpstreamErrorStatus =
      typeof upstreamStatus === 'string' &&
      upstreamStatus.toLowerCase() === 'error'

    if (!upstreamResponse.ok || isUpstreamErrorStatus) {
      const errorMessage =
        upstreamReason ||
        upstreamMessage ||
        `EscalionCloud upload failed with status ${upstreamResponse.status}`
      const responseStatus = upstreamResponse.ok ? 400 : upstreamResponse.status
      return Response.json(
        buildError('ESCALIONCLOUD_REQUEST_FAILED', errorMessage),
        { status: responseStatus }
      )
    }

    return Response.json({
      success: true,
      data: upstreamBody?.data ?? upstreamBody,
    })
  } catch (error) {
    console.log('EscalionCloud upload API error:', error)
    return Response.json(
      buildError(
        'INTERNAL_ERROR',
        'Unexpected error while uploading to EscalionCloud'
      ),
      { status: 500 }
    )
  }
}
