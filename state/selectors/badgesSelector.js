import { selector } from 'recoil'
import { pages, pagesGroups } from '@helpers/constants'

export const badgesSelector = selector({
  key: 'badgesSelector',
  get: ({ get }) => {
    const itemsBadges = {}
    const groups = {}
    pages.forEach(({ id, group, name, href, icon, badge }) => {
      if (badge) itemsBadges[id] = get(badge)
      else itemsBadges[id] = null
      if (!groups[group]) groups[group] = []
      groups[group].push(id)
    })

    const groupsBadges = {}
    pagesGroups.forEach(({ id, name, icon, access }) => {
      groupsBadges[id] = groups[id].reduce((result, id) => {
        if (typeof itemsBadges[id] === 'number') {
          if (typeof result === 'number') return result + itemsBadges[id]
          return itemsBadges[id]
        }
        return result
      }, null)
    })
    return { itemsBadges, groupsBadges }
  },
})

export default badgesSelector
