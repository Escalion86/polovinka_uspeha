import upperCaseFirst from './upperCaseFirst'

const getUserFullName = (user, showSecondName = true, showThirdName = true) => {
  const array = []
  if (user?.firstName) array.push(upperCaseFirst(user.firstName))
  if (showThirdName && user?.thirdName)
    array.push(upperCaseFirst(user.thirdName))
  if (showSecondName && user?.secondName)
    array.push(upperCaseFirst(user.secondName))

  return array.join(' ')
}

export default getUserFullName
