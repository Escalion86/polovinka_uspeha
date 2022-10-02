function getHoursBetween(start = new Date(), finish = new Date()) {
  return (new Date(finish).getTime() - new Date(start).getTime()) / 3600000
}

export default getHoursBetween
