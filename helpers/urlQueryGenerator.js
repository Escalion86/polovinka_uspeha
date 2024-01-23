const urlQueryGenerator = (url, params) => {
  if (!params || typeof params !== 'object' || Object.keys(params).length === 0)
    return url
  const query = Object.keys(params)
    .map(
      (k) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          typeof params[k] === 'object' ? JSON.stringify(params[k]) : params[k]
        )}`
    )
    .join('&')
  return url + '?' + query
}

export default urlQueryGenerator
