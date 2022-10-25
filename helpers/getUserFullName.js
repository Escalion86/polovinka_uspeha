import upperCaseFirst from './upperCaseFirst'

const getUserFullName = (user) => {
  const array = []
  if (user?.firstName) array.push(upperCaseFirst(user.firstName))
  if (user?.thirdName) array.push(upperCaseFirst(user.thirdName))
  if (user?.secondName) array.push(upperCaseFirst(user.secondName))

  return array.join(' ')
}

export default getUserFullName
