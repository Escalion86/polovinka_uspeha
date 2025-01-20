const getTimeZoneByLocation = (location) => {
  if (location === 'ekb') return 'Asia/Yekaterinburg'
  if (location === 'krsk') return 'Asia/Krasnoyarsk' //Asia/Yekaterinburg
  if (location === 'nrsk')
    return 'Asia/Krasnoyarsk' //Asia/Yekaterinburg
  else return
}

export default getTimeZoneByLocation
