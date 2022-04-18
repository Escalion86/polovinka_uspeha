const getNoun = (number, one, two, five, withNumber = true) => {
  let n = Math.abs(number)
  let res
  n %= 100
  if (n >= 5 && n <= 20) {
    res = five
  } else {
    n %= 10
    if (n === 1) {
      res = one
    } else if (n >= 2 && n <= 4) {
      res = two
    } else res = five
  }
  return (withNumber ? number + ' ' : '') + res
}

export default getNoun
