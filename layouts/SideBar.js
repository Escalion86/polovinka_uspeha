import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useState } from 'react'
import {
  // faUser,
  // faSignOutAlt,
  // faPlus,
  // faArrowUp,
  // faCross,
  // faTrash,
  // faChartBar,
  // faBars,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { pages, pagesGroups } from '@helpers/constants'
// import Burger from '@components/Burger'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import menuOpenAtom from '@state/atoms/menuOpen'
import Link from 'next/link'
// import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import badgesSelector from '@state/selectors/badgesSelector'

const menuCfg = (userActiveRole, userActiveStatus) => {
  return pagesGroups
    .filter(
      (pageGroup) =>
        pageGroup.accessRoles.includes(userActiveRole) &&
        (!pageGroup.accessStatuses ||
          pageGroup.accessStatuses.includes(userActiveStatus))
    )
    .reduce((totalGroups, group) => {
      const pagesItems = pages.reduce((totalPages, page) => {
        if (
          page.group === group.id &&
          page.accessRoles.includes(userActiveRole) &&
          (!page.accessStatuses ||
            page.accessStatuses.includes(userActiveStatus))
        ) {
          totalPages.push(page)
          // if (user.access && page.variable && user.access[page.variable]) {
          //   if (user.access[page.variable].page) totalPages.push(page)
          //   return totalPages
          // } else {
          //   if (user.access && user.access['other'].page) totalPages.push(page)
          //   return totalPages
          // }
        }
        return totalPages
      }, [])
      if (pagesItems.length > 0)
        totalGroups.push({
          name: group.name,
          icon: group.icon,
          items: pagesItems,
          bottom: group.bottom,
          id: group.id,
        })
      return totalGroups
    }, [])
}

const MenuItem = ({ item, active = false, badge }) => {
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  return (
    <Link href={'/cabinet/' + item.href} shallow>
      <a
        // className="flex items-center justify-between px-3 py-1 mt-2 duration-300 bg-gray-200 rounded-lg cursor-pointer flex-nowrap hover:bg-hover"
        className={cn(
          'flex items-center justify-between mb-1 rounded-lg cursor-pointer flex-nowrap ',
          active ? 'bg-general text-white' : '',
          'hover:bg-general hover:text-white'
        )}
        // onClick={() => {
        //   setPageId(item.id)
        // }}
        onClick={() => setMenuOpen(false)}
      >
        <div className={cn('flex items-center w-full px-3 py-1 gap-x-2 ')}>
          <FontAwesomeIcon icon={item.icon} className="w-5 h-5 min-w-5" />
          <span className={'text-sm font-medium whitespace-nowrap'}>
            {item.name}
          </span>
          {item.num !== null && (
            <span className="text-xs font-semibold text-general">
              {item.num}
            </span>
          )}
          {typeof badge === 'number' && badge > 0 && (
            <div className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full min-w-5 min-h-5 bg-danger">
              {badge <= 99 ? badge : '!'}
            </div>
          )}
        </div>
      </a>
    </Link>
  )
}

const Menu = ({ menuCfg, activePage }) => {
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenAtom)
  const [openedMenuIndex, setOpenedMenuIndex] = useState(1)

  const { itemsBadges, groupsBadges } = useRecoilValue(badgesSelector)

  const variants = {
    show: { height: 'auto' },
    hide: { height: 0 },
  }

  useEffect(() => {
    if (!menuOpen) setOpenedMenuIndex(null)
  }, [menuOpen])

  const indexOfActiveGroup = menuCfg.findIndex((item) =>
    item.items.find((item) => item.href === activePage)
  )

  return (
    <nav className="flex flex-col w-full h-full px-2 py-3 mt-1 gap-y-2">
      {menuCfg &&
        menuCfg.length > 0 &&
        menuCfg.map((item, index) => {
          const groupIsActive = index === indexOfActiveGroup
          const Component =
            item.items.length === 1
              ? (props) => (
                  <Link href={props.href} shallow>
                    <a {...props} />
                  </Link>
                )
              : (props) => <button {...props} />
          return (
            <div
              className={cn('z-50 flex flex-col', {
                'flex-1': item.bottom && !menuCfg[index - 1].bottom,
              })}
              key={index}
            >
              {item.bottom && !menuCfg[index - 1].bottom && (
                <div className="flex-1" />
              )}
              <div
                className={cn(
                  'duration-300 rounded-lg group',
                  groupIsActive
                    ? 'bg-white text-general'
                    : 'hover:bg-white hover:text-general text-white'
                )}
                key={'groupMenu' + index}
              >
                <Component
                  className={cn(
                    'flex gap-x-2 items-center w-full px-2 py-2 min-w-12 min-h-12 overflow-hidden'
                    // groupIsActive ? 'text-ganeral' : 'text-white'
                  )}
                  href={item.items[0].href}
                  onClick={() => {
                    if (item.items.length === 1) {
                      // setPageId(item.items[0].id)
                      setMenuOpen(false)
                    } else {
                      setOpenedMenuIndex(
                        openedMenuIndex === index ? null : index
                      )
                      setMenuOpen(true)
                    }
                  }}
                >
                  <div
                    className={cn(
                      'relative flex justify-center min-w-8 max-w-8 min-h-8 max-h-8'
                      // groupIsActive ? 'text-ganeral' : 'text-white'
                    )}
                  >
                    <FontAwesomeIcon icon={item.icon} size="2x" />
                    {item.items.length > 1 &&
                      typeof groupsBadges[item.id] === 'number' &&
                      groupsBadges[item.id] > 0 && (
                        <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-2 min-w-5 min-h-5 bg-danger">
                          {groupsBadges[item.id] <= 99
                            ? groupsBadges[item.id]
                            : '!'}
                        </div>
                      )}
                  </div>
                  <h3 className="flex-1 ml-3 font-semibold tracking-wide text-left uppercase whitespace-nowrap">
                    {item.items.length === 1 ? item.items[0].name : item.name}
                  </h3>

                  {item.items.length > 1 && (
                    <div
                      className={cn('w-4 duration-300 transition-transform', {
                        'rotate-180': openedMenuIndex === index,
                      })}
                    >
                      <FontAwesomeIcon icon={faAngleDown} size="lg" />
                    </div>
                  )}
                </Component>
                {item.items.length > 1 && (
                  <motion.div
                    variants={variants}
                    initial="hide"
                    animate={openedMenuIndex === index ? 'show' : 'hide'}
                    className="ml-3 mr-2 overflow-hidden"
                  >
                    {item.items.map((subitem, index) => (
                      <MenuItem
                        key={'menu' + subitem.id}
                        item={subitem}
                        active={activePage === subitem.href}
                        badge={itemsBadges[subitem.id]}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          )
        })}
    </nav>
  )
}

const SideBar = ({ page }) => {
  const wrapperRef = useRef(null)
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleAtom)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)

  const variants = {
    min: { width: '100%' },
    max: { width: 280 },
  }

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !event.target.classList.contains('menu-btn') &&
        !event.target.classList.contains('menu-btn__burger')
      )
        setMenuOpen(false)
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div
      className="relative top-0 bottom-0 z-50 flex flex-col w-0 tablet:w-16 bg-general"
      style={{ gridArea: 'sidebar' }}
      ref={wrapperRef}
    >
      <motion.div
        className={
          'absolute top-0 items-start z-10'
          // 'sidepanel fixed laptop:static w-64 h-full pb-15 laptop:pb-0 max-h-screen left-0 top-menu laptop:top-0 z-40 transform duration-300 border-t border-primary laptop:border-t-0 bg-white' +
          // (!menuOpen
          //   ? ' scale-x-0 -translate-x-32 w-0 laptop:w-64 laptop:transform-none'
          //   : '')
        }
        variants={variants}
        animate={!menuOpen ? 'min' : 'max'}
        transition={{ duration: 0.5, type: 'tween' }}
        initial={'min'}
        layout
      >
        <div className="flex flex-col w-full overflow-x-hidden overflow-y-auto">
          <Menu
            menuCfg={menuCfg(
              // pages,
              // pagesGroups,
              loggedUserActiveRole,
              loggedUserActiveStatus
            )}
            activePage={page}
          />
        </div>
      </motion.div>
      <motion.div
        variants={variants}
        animate={!menuOpen ? 'min' : 'max'}
        transition={{ duration: 0.5, type: 'tween' }}
        initial={'min'}
        layout
        className="absolute top-0 bottom-0 bg-general"
      />
    </div>
  )
}

export default SideBar
