'use client'

import ContentHeader from '@components/ContentHeader'
import Filter from '@components/Filter'
import UsersFilter from '@components/Filter/UsersFilter'
import AddButton from '@components/IconToggleButtons/AddButton'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import ServiceStatusToggleButtons from '@components/IconToggleButtons/ServiceStatusToggleButtons'
import Search from '@components/Search'
import SortingButtonMenu from '@components/SortingButtonMenu'
import filterItems from '@helpers/filterItems'
import { getNounProductsUsers } from '@helpers/getNoun'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import ProductsUsersList from '@layouts/lists/ProductsUsersList'
import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { unwrap } from 'jotai/utils'

const defaultFilterValue = {
  products: null,
}

const ProductsUsersContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const productsUsersAtom = useMemo(
    () => unwrap(asyncProductsUsersAtom, (prev) => prev ?? []),
    []
  )
  const usersAtom = useMemo(() => unwrap(usersAtomAsync, (prev) => prev ?? []), [])
  const productsUsers = useAtomValue(productsUsersAtom)
  const users = useAtomValue(usersAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.productsUsers?.add

  const [filterOptions, setFilterOptions] = useState(defaultFilterValue)

  const [filter, setFilter] = useState({
    gender: {
      male: true,
      famale: true,
      // null: true,
    },
  })

  const [filterService, setFilterService] = useState({
    status: {
      active: true,
      closed: false,
      canceled: false,
    },
  })

  // const usersIds = servicesUsers.map((serviceUser) => serviceUser.userId)
  // const usersWithServices = users.filter((user) => usersIds.includes(user._id))

  const updatedProductsUsers = useMemo(
    () =>
      productsUsers.map((productUser) => {
        const user = users.find((user) => user._id === productUser.userId)
        return { ...productUser, user }
      }),
    [productsUsers, users]
  )

  const [isSearching, setIsSearching] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ createdAt: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const filteredProductsUsers = useMemo(
    () =>
      updatedProductsUsers.filter(
        (productUser) =>
          productUser.user &&
          filter.gender[productUser.user.gender] &&
          (productUser.status
            ? filterService.status[productUser.status]
            : filterService.status.active) &&
          (!filterOptions.products ||
            filterOptions.products === productUser.productId)
      ),
    [filter, filterService, updatedProductsUsers, filterOptions]
  )

  const visibleProductsUsers = useMemo(() => {
    if (!isSearching || !searchText) return filteredProductsUsers
    return filterItems(
      filteredProductsUsers,
      searchText,
      [],
      {},
      [
        'firstName',
        'secondName',
        'thirdName',
        'phone',
        'whatsapp',
        'ok',
        'instagram',
        'telegram',
        'vk',
        'email',
      ],
      'user'
    )
  }, [filteredProductsUsers, searchText, isSearching])

  const filteredAndSortedProductsUsers = useMemo(
    () => [...visibleProductsUsers].sort(sortFunc),
    [visibleProductsUsers, sort]
  )

  const isFiltered = filterOptions.products

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} hideNullGender />
        <ServiceStatusToggleButtons
          value={filterService.status}
          onChange={(value) =>
            setFilterService((state) => ({ ...state, status: value }))
          }
        />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounProductsUsers(filteredAndSortedProductsUsers.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['createdAt']}
          />
          <FilterToggleButton
            value={isFiltered}
            onChange={() => {
              setShowFilter((state) => !state)
            }}
          />
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              // if (isSearching) setSearchText('')
            }}
          />
          {addButton && (
            <AddButton onClick={() => modalsFunc.productUser.add()} />
          )}
        </div>
      </ContentHeader>
      <Search
        searchText={searchText}
        show={isSearching}
        onChange={setSearchText}
        className="mx-1 bg-gray-100"
      />
      <Filter
        show={showFilter}
        onChange={setFilterOptions}
        filterOptions={filterOptions}
        defaultFilterValue={defaultFilterValue}
        setShowFilter={setShowFilter}
      />
      <ProductsUsersList productsUsers={filteredAndSortedProductsUsers} />
    </>
  )
}

export default ProductsUsersContent
