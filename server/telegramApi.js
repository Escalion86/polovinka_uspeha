import dns from 'dns'
import { Agent as UndiciAgent } from 'undici'

const contentType = 'application/json'

const lookupIPv4 = (hostname, options, callback) => {
  if (typeof options === 'function') {
    return dns.lookup(hostname, { family: 4 }, options)
  }

  return dns.lookup(hostname, { ...(options || {}), family: 4 }, callback)
}

const telegramDispatcher = new UndiciAgent({
  connect: {
    lookup: lookupIPv4,
    family: 4,
  },
})

export const telegramPost = async (
  url,
  form,
  callbackOnSuccess = null,
  callbackOnError = null,
  resJson = false
) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: contentType,
        'Content-Type': contentType,
      },
      body: JSON.stringify(form),
      dispatcher: telegramDispatcher,
    })

    if (!res.ok) {
      throw new Error(res.status)
    }

    const json = await res.json()
    const result = resJson ? json : json.data

    if (callbackOnSuccess) callbackOnSuccess(result)

    return result
  } catch (error) {
    console.log('Failed to add (POST) on ' + url)
    console.log(error)
    if (callbackOnError) callbackOnError(error)
    return null
  }
}

export default telegramPost
