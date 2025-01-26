import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { pages } from '@helpers/constants'

const badgesGroupSelector = atomFamily((groupId) =>
  atom((get) => {
    // const groupPages = pages.filter(({ group }) => groupId === group)

    // let groupBadge = 0
    const pagesIdsWithBadge = {}

    const groupPagesWithBadgesNum = pages.filter(
      ({ group, hidden }) => groupId === group && (!hidden || !get(hidden))
    )
    // .map((page) => {
    //   if (page.badge) {
    //     const pageBadge = get(page.badge)
    //     pagesIdsWithBadge[page.id] = pageBadge
    //     // groupBadge += pageBadge
    //     return { ...page, badgeNum: pageBadge }
    //   }
    //   return page
    // })

    groupPagesWithBadgesNum.forEach((page) => {
      if (page.badge) {
        const pageBadge = get(page.badge)
        pagesIdsWithBadge[page.id] = pageBadge
        // groupBadge += pageBadge
        // return { ...page, badgeNum: pageBadge }
      }
      // return page
    })

    if (groupPagesWithBadgesNum.length === 0)
      return {
        groupHidden: true,
        // pages: [],
        // groupBadge,
        pagesIdsWithBadge,
      }

    return {
      groupHidden: false,
      // pages: groupPagesWithBadgesNum,
      // groupBadge,
      pagesIdsWithBadge,
    }
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
  })
)

export default badgesGroupSelector
