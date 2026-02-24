const VK_ID_DOMAIN_DEFAULT = 'id.vk.ru'

const getVkClientId = () => {
  const raw = process.env.VK_ID_APP_ID || process.env.NEXT_PUBLIC_VK_ID_APP_ID
  const parsed = Number.parseInt(String(raw || ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const getVkDomain = () => process.env.VK_ID_DOMAIN || VK_ID_DOMAIN_DEFAULT

const normalizeUrlString = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const noQuotes = raw.replace(/^['"]|['"]$/g, '').trim()
  try {
    return new URL(noQuotes).toString()
  } catch {
    return ''
  }
}

const getVkRedirectUrl = () =>
  normalizeUrlString(process.env.VK_ID_REDIRECT_URI) ||
  normalizeUrlString(
    process.env.DOMAIN ? `${process.env.DOMAIN}/api/vk-id/callback` : ''
  )

const toFormBody = (data = {}) => {
  const form = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return
    form.append(key, String(value))
  })
  return form
}

const safeJson = async (response) => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

const vkOAuthRequest = async ({
  path,
  query = {},
  body = {},
  method = 'POST',
}) => {
  const clientId = getVkClientId()
  if (!clientId) {
    return {
      success: false,
      data: {
        error: {
          type: 'VK_CONFIG_ERROR',
          message: 'VK app id is not configured',
        },
      },
    }
  }
  const domain = getVkDomain()
  const queryParams = new URLSearchParams({
    client_id: String(clientId),
    ...Object.fromEntries(
      Object.entries(query || {}).filter(([, value]) => value !== undefined)
    ),
  })

  const url = `https://${domain}${path}?${queryParams.toString()}`
  const response = await fetch(url, {
    method,
    body: toFormBody(body),
  })
  const data = await safeJson(response)

  if (!response.ok) {
    return {
      success: false,
      data: {
        error: {
          type: 'VK_HTTP_ERROR',
          message: 'VK service returned an error response',
        },
        vk: data,
      },
    }
  }

  if (!data || data.error) {
    return {
      success: false,
      data: {
        error: {
          type: 'VK_API_ERROR',
          message: data?.error_description || data?.error || 'VK API error',
        },
        vk: data,
      },
    }
  }

  return {
    success: true,
    data,
  }
}

const exchangeVkCode = async ({ code, deviceId, codeVerifier, state }) => {
  const redirectUri = getVkRedirectUrl()
  if (!redirectUri) {
    return {
      success: false,
      data: {
        error: {
          type: 'VK_CONFIG_ERROR',
          message: 'VK redirect URI is not configured',
        },
      },
    }
  }

  return await vkOAuthRequest({
    path: '/oauth2/auth',
    query: {
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      device_id: deviceId,
      state: state || 'vkid_state',
      code_verifier: codeVerifier,
    },
    body: { code },
  })
}

const fetchVkUserInfo = async ({ accessToken }) => {
  return await vkOAuthRequest({
    path: '/oauth2/user_info',
    body: {
      access_token: accessToken,
    },
  })
}

export { exchangeVkCode, fetchVkUserInfo }
