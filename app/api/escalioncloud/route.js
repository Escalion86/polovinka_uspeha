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

const normalizePathSegment = (value) =>
  typeof value === 'string' ? value.trim().replace(/^\/+|\/+$/g, '') : ''

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
    const files = incomingFormData.getAll('files')
    const directoryRaw = incomingFormData.get('directory')
    const legacyProjectRaw = incomingFormData.get('project')
    const legacyFolderRaw = incomingFormData.get('folder')

    const directoryFromNewContract = normalizePathSegment(directoryRaw)
    const legacyProject = normalizePathSegment(legacyProjectRaw)
    const legacyFolder = normalizePathSegment(legacyFolderRaw)
    const directory =
      directoryFromNewContract ||
      [legacyProject, legacyFolder].filter(Boolean).join('/')

    if (!files.length) {
      return Response.json(
        buildError('VALIDATION_ERROR', 'No files provided for upload'),
        { status: 400 }
      )
    }

    if (!directory) {
      return Response.json(
        buildError(
          'VALIDATION_ERROR',
          'Directory is required. Expected "<project>/<folder>"'
        ),
        { status: 400 }
      )
    }

    files.forEach((file) => formData.append('files', file))
    formData.append('directory', directory)

    const upstreamResponse = await fetch(ESCALIONCLOUD_API_URL, {
      method: 'POST',
      headers: {
        'x-api-password': password,
      },
      body: formData,
    })
    const upstreamBody = await parseUpstreamResponse(upstreamResponse)
    console.log('EscalionCloud upload response:', {
      status: upstreamResponse.status,
      ok: upstreamResponse.ok,
      contentType: upstreamResponse.headers.get('content-type'),
      resolvedDirectory: directory,
      body: upstreamBody,
    })

    if (!upstreamResponse.ok) {
      const upstreamMessage =
        upstreamBody?.reason || upstreamBody?.message || upstreamBody
      const errorMessage =
        typeof upstreamMessage === 'string'
          ? upstreamMessage
          : JSON.stringify(upstreamMessage) ||
        `EscalionCloud upload failed with status ${upstreamResponse.status}`
      return Response.json(
        buildError('ESCALIONCLOUD_REQUEST_FAILED', errorMessage),
        { status: upstreamResponse.status }
      )
    }

    return Response.json({
      success: true,
      data: Array.isArray(upstreamBody)
        ? upstreamBody
        : upstreamBody?.data ?? upstreamBody,
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
