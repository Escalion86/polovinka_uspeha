import browserVer from './browserVer'

const isBrowserNeedToBeUpdate = () => {
  const [browser, ver] = browserVer()
  if (browser === 'Apple Safari' && parseInt(ver[0]) < 602)
    return 'https://apps.apple.com/ru/app/safari/id1146562112?l=ru'
  if (browser === 'Google Chrome or Chromium' && parseInt(ver[0]) < 104)
    return 'https://www.google.com/intl/ru_ru/chrome/'
  if (browser === 'Yandex browser' && parseInt(ver[0]) < 22)
    return 'https://browser.yandex.ru/'
  if (browser === 'Samsung Browser' && parseInt(ver[0]) < 19)
    return 'https://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser'
  return null
}

export default isBrowserNeedToBeUpdate
