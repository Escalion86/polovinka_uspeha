import urlQueryGenerator from './urlQueryGenerator'

const contentType = 'application/json'

const getFetch = async (url, params) =>
  await fetch(urlQueryGenerator(url, params), {
    method: 'GET',
    headers: {
      Accept: contentType,
      'Content-Type': contentType,
    },
  })

export default getFetch
