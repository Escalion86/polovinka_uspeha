const arrayMove = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex]
  const newArr = [...arr]
  newArr.splice(fromIndex, 1)
  newArr.splice(toIndex, 0, element)
  return newArr
}

export default arrayMove
