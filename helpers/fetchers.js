export async function fetchingAll(setState = () => {}) {
  const urls = ['/api/admin']
  const result = await Promise.all(
    urls.map(async (url) => {
      const resp = await fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)
      return resp
    })
  )
  setState(result[0])
  return result[0]
}

export async function fetchingEvents(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/events`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingEvents ERROR:', error))
  return resp
}

export async function fetchingDirections(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/directions`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingDirections ERROR:', error))
  return resp
}

export async function fetchingReviews(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/reviews`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingReviews ERROR:', error))
  return resp
}

export async function fetchingAdditionalBlocks(
  domen = process.env.NEXTAUTH_SITE
) {
  const resp = await fetch(`${domen}/api/additionalBlocks`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingAdditionalBlocks ERROR:', error))
  return resp
}

export async function fetchingPayments(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/payments`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingPayments ERROR:', error))
  return resp
}

export async function fetchingUsers(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/users`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUsers ERROR:', error))
  return resp
}

export async function fetchingUsersById(id, domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/users/byId/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUsersById ERROR:', error))
  return resp
}

export async function fetchingUserByEmail(
  email,
  domen = process.env.NEXTAUTH_SITE
) {
  const resp = await fetch(`${domen}/api/users/byEmail/${email}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUserByEmail ERROR:', error))
  return resp
}

export async function fetchingUserByPhone(
  phone,
  domen = process.env.NEXTAUTH_SITE
) {
  const resp = await fetch(`${domen}/api/users/byPhone/${phone}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUserByPhone ERROR:', error))
  return resp
}

export async function fetchingLog(data, domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingLog')
  const resp = await fetch(`${domen}/api/log`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    // 'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingLog ERROR:', error))
  return resp
}

export async function fetchingEventsUsers(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/eventsusers`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingEventsUsers ERROR:', error))
  return resp
}

export async function fetchingSiteSettings(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/site`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingSiteSettings ERROR:', error))
  return resp
}

export async function fetchingLoginHistory(domen = process.env.NEXTAUTH_SITE) {
  const resp = await fetch(`${domen}/api/loginhistory`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingLoginHistory ERROR:', error))
  return resp
}
