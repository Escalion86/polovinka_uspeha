const browserVer = (object = false) => {
  var sBrowser,
    sBrowserVer,
    sUsrAg = navigator.userAgent
  //'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/603.1 980x1306'

  //The order matters here, and this may report false positives for unlisted browsers.

  if (sUsrAg.indexOf('Firefox') > -1) {
    sBrowser = 'Mozilla Firefox'
    const str = sUsrAg.substring(sUsrAg.indexOf('Firefox') + 8)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (sUsrAg.indexOf('Opera') > -1) {
    sBrowser = 'Opera'
    const str = sUsrAg.substring(sUsrAg.indexOf('Opera') + 6)
    sBrowserVer = str.substring(0, str.indexOf(' '))
  } else if (sUsrAg.indexOf('Trident') > -1) {
    sBrowser = 'Microsoft Internet Explorer'
    const str = sUsrAg.substring(sUsrAg.indexOf('Trident') + 8)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
    sBrowser = 'Samsung Browser'
    const str = sUsrAg.substring(sUsrAg.indexOf('SamsungBrowser') + 15)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf('Edge') > -1) {
    sBrowser = 'Microsoft Edge'
    const str = sUsrAg.substring(sUsrAg.indexOf('Edge') + 5)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (sUsrAg.indexOf('YaBrowser') > -1) {
    sBrowser = 'Yandex browser'
    const str = sUsrAg.substring(sUsrAg.indexOf('YaBrowser') + 10)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/23.1.5.708 Yowser/2.5 Safari/537.36
  } else if (sUsrAg.indexOf('Chrome') > -1) {
    sBrowser = 'Google Chrome or Chromium'
    const str = sUsrAg.substring(sUsrAg.indexOf('Chrome') + 7)
    sBrowserVer = str.substring(0, str.indexOf(' '))
    //"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (sUsrAg.indexOf('Safari') > -1) {
    sBrowser = 'Apple Safari'
    const str = sUsrAg.substring(sUsrAg.indexOf('Safari') + 7)
    sBrowserVer = str.substring(
      0,
      str.indexOf(' ') > 0 ? str.indexOf(' ') : undefined
    )
    //"Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    sBrowser = 'unknown'
  }
  if (object)
    return { sBrowser, sBrowserVer, sUsrAg, platform: navigator.platform }
  return [sBrowser, sBrowserVer.split('.')]
}

export default browserVer
