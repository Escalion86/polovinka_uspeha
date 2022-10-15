function getDiffBetweenDates(start = new Date(), finish = new Date()) {
  return new Date(finish).getTime() - new Date(start).getTime()
}

export default getDiffBetweenDates
