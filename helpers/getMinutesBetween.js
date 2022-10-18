function getMinutesBetween(start = new Date(), finish = new Date()) {
  return (new Date(finish).getTime() - new Date(start).getTime()) / 60000
}

export default getMinutesBetween
