import filterWithRules from './filterWithRules'

const filterItems = (
  items = [],
  searchText = '',
  exceptedIds = [],
  rules = {},
  keys = ['title', 'firstName', 'secondName', 'thirdName'],
  parentKey
) =>
  // (
  {
    const filteredWithRules = filterWithRules(items, rules)

    const searchWordsArray = searchText
      ? searchText
          .toLowerCase()
          .split(' ')
          .filter((word) => word)
      : []

    return searchText || exceptedIds?.length
      ? filteredWithRules.filter((item) => {
          if (searchText) {
            if (searchText[0] === '>') {
              if (searchText[1] === '=')
                return item.price >= parseInt(searchText.substr(2)) * 100
              return item.price > parseInt(searchText.substr(1)) * 100
            }
            if (searchText[0] === '<') {
              if (searchText[1] === '=')
                return item.price <= parseInt(searchText.substr(2)) * 100
              return item.price < parseInt(searchText.substr(1)) * 100
            }
            if (searchText[0] === '=') {
              return item.price == parseInt(searchText.substr(1)) * 100
            }

            if (
              !(
                !exceptedIds ||
                typeof exceptedIds !== 'object' ||
                !exceptedIds?.includes(item._id)
              )
            )
              return false

            if (!parentKey) {
              const keysTemp = [...keys]
              return (
                searchWordsArray.filter((searchWord) => {
                  const index = keysTemp.findIndex(
                    (key) =>
                      item[key]
                        ?.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(searchWord) === 0
                  )
                  if (index >= 0) keysTemp.splice(index, 1)
                  return index >= 0
                }).length === searchWordsArray.length
              )
            } else {
              const keysTemp = [...keys]
              return (
                searchWordsArray.filter((searchWord) => {
                  const index = keysTemp.findIndex(
                    (key) =>
                      item[parentKey][key]
                        ?.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(searchWord) === 0
                  )
                  if (index >= 0) keysTemp.splice(index, 1)
                  return index >= 0
                }).length === searchWordsArray.length
              )
            }
          } else
            return (
              !exceptedIds ||
              typeof exceptedIds !== 'object' ||
              !exceptedIds?.includes(item._id)
            )
        })
      : filteredWithRules
  }
// ).sort((a, b) => {
//   if (a.name < b.name) {
//     return -1
//   }
//   if (a.name > b.name) {
//     return 1
//   }
//   return 0
// })

export default filterItems
