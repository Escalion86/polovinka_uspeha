const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const enquiryPath = path.join(process.cwd(), 'server', 'api', 'enquiry.js')

const loadEnquiryHandler = ({ fetchImpl }) => {
  const source = fs
    .readFileSync(enquiryPath, 'utf8')
    .replace(/export\s+default\s+handler\s*;?/, 'module.exports = handler')

  const context = {
    console,
    fetch: fetchImpl,
    module: { exports: {} },
  }

  vm.runInNewContext(source, context, { filename: enquiryPath })

  return context.module.exports
}

const createMockResponse = () => {
  const state = {
    payload: undefined,
    statusCode: undefined,
  }

  return {
    state,
    res: {
      json(payload) {
        state.payload = payload
        return this
      },
      status(code) {
        state.statusCode = code
        return this
      },
    },
  }
}

test('enquiry handler waits for Google reCAPTCHA before sending success JSON', async () => {
  let resolveFetch
  const fetchPromise = new Promise((resolve) => {
    resolveFetch = resolve
  })
  const handler = loadEnquiryHandler({
    fetchImpl: () => fetchPromise,
  })
  const { res, state } = createMockResponse()

  const result = handler(
    {
      method: 'POST',
      body: { gRecaptchaToken: 'test-token' },
    },
    res
  )

  assert.equal(
    typeof result?.then,
    'function',
    'handler must return a promise so the App Router wrapper waits for JSON'
  )
  assert.equal(state.payload, undefined)

  resolveFetch({
    json: async () => ({
      action: 'enquiryFormSubmit',
      score: 0.9,
      success: true,
    }),
  })

  await result

  assert.equal(state.statusCode, 200)
  assert.equal(state.payload?.status, 'success')
  assert.equal(state.payload?.message, 'Enquiry submitted successfully')
})
