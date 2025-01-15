export async function fetchingAll(location, setState = () => {}) {
  const urls = [`/api/${location}/admin`]
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

export async function fetchingEvents(location) {
  const resp = await fetch(`/api/${location}/events`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingEvents ERROR:', error))
  return resp
}

export async function fetchingDirections(location) {
  const resp = await fetch(`/api/${location}/directions`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingDirections ERROR:', error))
  return resp
}

export async function fetchingReviews(location) {
  const resp = await fetch(`/api/${location}/reviews`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingReviews ERROR:', error))
  return resp
}

export async function fetchingAdditionalBlocks(location) {
  const resp = await fetch(`/api/${location}/additionalblocks`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingAdditionalBlocks ERROR:', error))
  return resp
}

export async function fetchingPayments(location) {
  const resp = await fetch(`/api/${location}/payments`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingPayments ERROR:', error))
  return resp
}

export async function fetchingUsers(location) {
  const resp = await fetch(`/api/${location}/users`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUsers ERROR:', error))
  return resp
}

export async function fetchingUsersById(id, location) {
  const resp = await fetch(`/api/${location}/users/byId/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUsersById ERROR:', error))
  return resp
}

export async function fetchingUserByEmail(email, location) {
  const resp = await fetch(`/api/${location}/users/byEmail/${email}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUserByEmail ERROR:', error))
  return resp
}

export async function fetchingUserByPhone(phone, location) {
  const resp = await fetch(`/api/${location}/users/byPhone/${phone}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingUserByPhone ERROR:', error))
  return resp
}

export async function fetchingLog(data, location) {
  // console.log('Запущен fetchingLog')
  const resp = await fetch(`/api/${location}/log`, {
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

export async function fetchingEventsUsers(location) {
  const resp = await fetch(`/api/${location}/eventsusers`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingEventsUsers ERROR:', error))
  return resp
}

export async function fetchingSiteSettings(location) {
  const resp = await fetch(`/api/${location}/site`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingSiteSettings ERROR:', error))
  return resp
}

export async function fetchingHistories(location) {
  const resp = await fetch(`/api/${location}/histories`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingHistories ERROR:', error))
  return resp
}

export async function fetchingLoginHistory(location) {
  const resp = await fetch(`/api/${location}/loginhistory`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log('fetchingLoginHistory ERROR:', error))
  return resp
}
