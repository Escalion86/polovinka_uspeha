import { selectorFamily } from 'recoil'
import { pages } from '@helpers/constants'

export const badgesGroupSelector = selectorFamily({
  key: 'badgesGroupSelector',
  get:
    (groupId) =>
    ({ get }) => {
      const groupPages = pages.filter(({ group }) => groupId === group)

      let groupBadge = 0

      const groupPagesWithBadgesNum = groupPages
        .filter(({ hidden }) => !hidden || !get(hidden))
        .map((page) => {
          if (page.badge) {
            const pageBadge = get(page.badge)
            groupBadge += pageBadge
            return { ...page, badgeNum: pageBadge }
          }
          return page
        })

      if (groupPagesWithBadgesNum.length === 0)
        return { groupHidden: true, pages: [], groupBadge }

      return { groupHidden: false, pages: groupPagesWithBadgesNum, groupBadge }
      // const groupsBadges = {}
      // pagesGroups.forEach(({ id, name, icon, access }) => {
      //   groupsBadges[id] = groups[id].reduce((result, id) => {
      //     if (typeof itemsBadges[id] === 'number') {
      //       if (typeof result === 'number') return result + itemsBadges[id]
      //       return itemsBadges[id]
      //     }
      //     return result
      //   }, null)
      //   const visiblePagesOfGroup = pages.filter(
      //     (page) => page.group === id && !hiddenMenus.includes(page.id)
      //   )
      //   if (visiblePagesOfGroup.length === 0) hiddenGroups.push(id)
      // })

      // return { itemsBadges, groupsBadges, hiddenMenus, hiddenGroups }
    },
})

export default badgesGroupSelector
