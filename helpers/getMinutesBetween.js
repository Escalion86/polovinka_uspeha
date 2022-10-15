function getMinutesBetween(start = new Date(), finish = new Date()) {
  console.log('finish', finish)
  console.log('start', start)
  console.log('!finish', new Date(finish).getTime())
  console.log('!start', new Date(start).getTime())

  return (new Date(finish).getTime() - new Date(start).getTime()) / 60000
}

export default getMinutesBetween
