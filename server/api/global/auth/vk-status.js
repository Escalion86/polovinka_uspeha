import checkLocationValid from '@server/checkLocationValid'
import getCityPolicy from '@server/getCityPolicy'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      data: {
        error: {
          type: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
        },
      },
    })
  }

  const location = String(req.query?.location || '').trim()
  if (!checkLocationValid(location)) {
    return res.status(400).json({
      success: false,
      data: {
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Location is invalid',
        },
      },
    })
  }

  const policyResult = await getCityPolicy(location)
  if (!policyResult.success) {
    return res.status(200).json({
      success: true,
      data: {
        location,
        allowVkAuth: false,
        source: 'fallback',
      },
    })
  }

  return res.status(200).json({
    success: true,
    data: {
      location,
      allowVkAuth: Boolean(policyResult?.data?.policy?.allowVkAuth),
      source: 'policy',
    },
  })
}

