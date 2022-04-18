import React, { useEffect } from 'react'
import cn from 'classnames'
import { useState } from 'react'
import {
  faUser,
  faSignOutAlt,
  faPlus,
  faArrowUp,
  faCross,
  faTrash,
  faChartBar,
  faBars,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { pages, pagesGroups } from '@helpers/constants'
import Burger from '@components/Burger'
import { useRecoilState } from 'recoil'
import menuOpenAtom from '@state/atoms/menuOpen'

const menuCfg = (pages, pagesGroups, user) => {
  return pagesGroups.reduce((totalGroups, group) => {
    const pagesItems = pages.reduce((totalPages, page) => {
      if (page.group === group.id) {
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
      })
    return totalGroups
  }, [])
}

const MenuItem = ({
  item,
  setPageId = () => {},
  active = false,
  groupIsActive,
}) => {
  return (
    <a
      // className="flex items-center justify-between px-3 py-1 mt-2 duration-300 bg-gray-200 rounded-lg cursor-pointer flex-nowrap hover:bg-hover"
      className={cn(
        'flex items-center justify-between mb-1 duration-300 rounded-lg cursor-pointer group-hover:text-general flex-nowrap hover:bg-general',
        groupIsActive ? 'text-primary' : 'text-white'
      )}
      onClick={() => {
        setPageId(item.id)
      }}
    >
      <div className="w-full px-3 py-1 hover:text-white">
        <span className={'text-sm font-medium whitespace-nowrap'}>
          {item.name}
        </span>
        {item.num !== null && (
          <span className="text-xs font-semibold text-general">{item.num}</span>
        )}
      </div>
    </a>
  )
}

const Menu = ({ menuCfg, setPageId, activePageId = 0 }) => {
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenAtom)
  const [openedMenuIndex, setOpenedMenuIndex] = useState(1)
  const variants = {
    show: { height: 'auto' },
    hide: { height: 0 },
  }

  useEffect(() => {
    if (!menuOpen) setOpenedMenuIndex(null)
  }, [menuOpen])

  const indexOfActiveGroup = menuCfg.findIndex((item) =>
    item.items.find((item) => item.id === activePageId)
  )

  return (
    <nav className="flex flex-col w-full h-full mt-1 gap-y-2">
      {menuCfg &&
        menuCfg.length > 0 &&
        menuCfg.map((item, index) => {
          const groupIsActive = index === indexOfActiveGroup
          return (
            <div
              className={cn('flex flex-col', {
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
                <button
                  className={cn(
                    'flex items-center w-full px-2 py-2 min-w-12 min-h-12 overflow-hidden'
                    // groupIsActive ? 'text-ganeral' : 'text-white'
                  )}
                  onClick={() => {
                    if (item.items.length === 1) {
                      setPageId(item.items[0].id)
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
                      'flex justify-center min-w-8 max-w-8 min-h-8 max-h-8'
                      // groupIsActive ? 'text-ganeral' : 'text-white'
                    )}
                  >
                    <FontAwesomeIcon icon={item.icon} size="2x" />
                  </div>
                  <h3 className="flex-1 ml-5 font-semibold tracking-wide text-left uppercase whitespace-nowrap">
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
                </button>
                {item.items.length > 1 && (
                  <motion.div
                    variants={variants}
                    initial="hide"
                    animate={openedMenuIndex === index ? 'show' : 'hide'}
                    className="ml-10 mr-2 overflow-hidden"
                  >
                    {item.items.map((subitem, index) => (
                      <MenuItem
                        key={'menu' + subitem.id}
                        item={subitem}
                        setPageId={(id) => {
                          setOpenedMenuIndex(null)
                          setMenuOpen(false)
                          setPageId(id)
                        }}
                        groupIsActive={groupIsActive}
                        active={activePageId === subitem.id}
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

const SideBar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useRecoilState(menuOpenAtom)
  const variants = {
    min: { width: 64 },
    max: { width: 280 },
  }

  return (
    <div className="relative w-16" style={{ gridArea: 'sidebar' }}>
      <div className="flex items-center justify-center h-16 bg-general">
        <Burger />
      </div>
      <motion.div
        className={
          'flex flex-col items-start z-50 bg-general h-full absolute top-16 left-0'
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
        <div className="flex flex-col flex-1 w-full px-2 py-3 overflow-y-auto border-r border-general">
          <Menu
            menuCfg={menuCfg(pages, pagesGroups, user)}
            setPageId={(id) => {
              setPageId(id)
              closeMenu()
            }}
            activePageId={0}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default SideBar
