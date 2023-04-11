import browserVer from './browserVer'

const isBrowserNeedToBeUpdate = () => {
  const [browser, ver] = browserVer()
  if (browser === 'Apple Safari' && parseInt(ver[0]) < 604)
    return 'https://apps.apple.com/ru/app/safari/id1146562112?l=ru'
  if (browser === 'Google Chrome or Chromium' && parseInt(ver[0]) < 109)
    return 'https://www.google.com/intl/ru_ru/chrome/'
  return null
}

export default isBrowserNeedToBeUpdate
