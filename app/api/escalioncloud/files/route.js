const ESCALIONCLOUD_FILES_API_URL = 'https://api.escalioncloud.ru/api/files'

const buildError = (type, message) => ({
  success: false,
  data: {
    error: {
      type,
      message,
    },
  },
})

const parseBoolean = (value) =>
  value === 'true' || value === '1' || value === true

const parseUpstreamResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function GET(request) {
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
    const { searchParams } = new URL(request.url)
    const directory = searchParams.get('directory')
    const noFoldersParam = searchParams.get('noFolders')

    const payload = { password }
    if (directory) payload.directory = directory
    if (noFoldersParam !== null) payload.noFolders = parseBoolean(noFoldersParam)

    const upstreamResponse = await fetch(ESCALIONCLOUD_FILES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const upstreamBody = await parseUpstreamResponse(upstreamResponse)

    if (!upstreamResponse.ok) {
      return Response.json(
        buildError(
          'ESCALIONCLOUD_REQUEST_FAILED',
          `EscalionCloud files request failed with status ${upstreamResponse.status}`
        ),
        { status: upstreamResponse.status }
      )
    }

    return Response.json({
      success: true,
      data: upstreamBody?.data ?? upstreamBody,
    })
  } catch (error) {
    console.log('EscalionCloud files API error:', error)
    return Response.json(
      buildError(
        'INTERNAL_ERROR',
        'Unexpected error while fetching files from EscalionCloud'
      ),
      { status: 500 }
    )
  }
}

