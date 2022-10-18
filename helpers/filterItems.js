import filterWithRules from './filterWithRules'

const filterItems = (
  items = [],
  searchText = '',
  exceptedIds = [],
  rules = {}
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
              (item.title
                ?.toString()
                .toLowerCase()
                .includes(searchTextLowerCase) ||
                item.name
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTextLowerCase) ||
                item.firstName
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTextLowerCase) ||
                item.secondName
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTextLowerCase) ||
                item.thirdName
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTextLowerCase) ||
                item.number?.toString().includes(searchTextLowerCase) ||
                item.phone?.toString().includes(searchTextLowerCase) ||
                item.whatsapp?.toString().includes(searchTextLowerCase) ||
                item.viber?.toString().includes(searchTextLowerCase) ||
                item.telegram?.toString().includes(searchTextLowerCase) ||
                item.instagram?.toString().includes(searchTextLowerCase) ||
                item.vk?.toString().includes(searchTextLowerCase) ||
                item.price?.toString().includes(searchTextLowerCase))
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
