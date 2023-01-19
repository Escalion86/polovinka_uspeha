import filterWithRules from './filterWithRules'

const filterItems = (
  items = [],
  searchText = '',
  exceptedIds = [],
  rules = {},
  keys = ['title', 'firstName', 'secondName', 'thirdName']
) =>
  // (
  {
    const filteredWithRules = filterWithRules(items, rules)
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

            const searchTextLowerCase = searchText.toLowerCase()
            return (
              (!exceptedIds ||
                typeof exceptedIds !== 'object' ||
                !exceptedIds?.includes(item._id)) &&
              keys.find((key) =>
                item[key]
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTextLowerCase)
              )
            )
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
