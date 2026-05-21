const BODYLESS_METHODS = new Set(['GET', 'HEAD'])

const appendQueryValue = (query, key, value) => {
  if (Object.prototype.hasOwnProperty.call(query, key)) {
    query[key] = Array.isArray(query[key])
      ? [...query[key], value]
      : [query[key], value]
    return
  }

  query[key] = value
}

const getRequestBody = async (request) => {
  if (BODYLESS_METHODS.has(request.method)) return undefined

  const contentType = request.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      return await request.json()
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      return Object.fromEntries(formData.entries())
    }

    if (contentType.includes('multipart/form-data')) {
      return await request.formData()
    }

    const text = await request.text()
    return text || undefined
  } catch {
    return undefined
  }
}

const buildRequestHeaders = (request) => {
  const headers = {}
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })
  return headers
}

const buildPagesRequest = async (request, params) => {
  const url = new URL(request.url)
  const query = {}

  url.searchParams.forEach((value, key) => {
    appendQueryValue(query, key, value)
  })

  Object.entries(params || {}).forEach(([key, value]) => {
    query[key] = value
  })

  return {
    body: await getRequestBody(request),
    cookies: Object.fromEntries(
      (request.headers.get('cookie') || '')
        .split(';')
        .map((part) => part.trim().split('='))
        .filter(([key]) => key)
        .map(([key, ...value]) => [key, decodeURIComponent(value.join('='))])
    ),
    headers: buildRequestHeaders(request),
    method: request.method,
    query,
    url: `${url.pathname}${url.search}`,
  }
}

const buildPagesResponse = () => {
  const headers = new Headers()
  const state = {
    body: undefined,
    sent: false,
    statusCode: 200,
  }

  const res = {
    get statusCode() {
      return state.statusCode
    },
    set statusCode(value) {
      state.statusCode = value
    },
    end(body = '') {
      state.body = body
      state.sent = true
      return this
    },
    getHeader(name) {
      return headers.get(name)
    },
    json(payload) {
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json; charset=utf-8')
      }
      state.body = JSON.stringify(payload)
      state.sent = true
      return this
    },
    redirect(statusOrUrl, maybeUrl) {
      const hasStatus = typeof statusOrUrl === 'number'
      state.statusCode = hasStatus ? statusOrUrl : 307
      headers.set('location', hasStatus ? maybeUrl : statusOrUrl)
      state.body = ''
      state.sent = true
      return this
    },
    setHeader(name, value) {
      headers.set(name, Array.isArray(value) ? value.join(', ') : String(value))
      return this
    },
    status(code) {
      state.statusCode = code
      return this
    },
  }

  return { headers, res, state }
}

export function createPagesApiRouteHandler(handler) {
  return async function pagesApiRouteHandler(request, context = {}) {
    const params =
      typeof context.params?.then === 'function'
        ? await context.params
        : context.params || {}
    const req = await buildPagesRequest(request, params)
    const { headers, res, state } = buildPagesResponse()

    const result = await handler(req, res)

    if (result instanceof Response) {
      return result
    }

    if (request.method === 'HEAD') {
      return new Response(null, {
        headers,
        status: state.statusCode,
      })
    }

    return new Response(state.body ?? '', {
      headers,
      status: state.statusCode,
    })
  }
}
