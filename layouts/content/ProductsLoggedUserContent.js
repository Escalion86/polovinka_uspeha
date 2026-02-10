'use client'

import ContentHeader from '@components/ContentHeader'
import { getNounProductsUsers } from '@helpers/getNoun'
import ProductsUsersList from '@layouts/lists/ProductsUsersList'
import asyncProductsUsersByUserIdSelector from '@state/async/asyncProductsUsersByUserIdSelector'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

const ProductsLoggedUserContent = () => {
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const productsLoggedUser = useAtomValue(
    asyncProductsUsersByUserIdSelector(loggedUserActive._id)
  )
  const productsWithUser = useMemo(
    () =>
      productsLoggedUser.map((productUser) => ({
        ...productUser,
        user: loggedUserActive,
      })),
    [productsLoggedUser, loggedUserActive]
  )

  // const [isSearching, setIsSearching] = useState(false)
  // const [searchText, setSearchText] = useState('')

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounProductsUsers(productsLoggedUser.length)}
          </div>
          {/* <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          /> */}
        </div>
      </ContentHeader>
      {/* <Search
        searchText={searchText}
        show={isSearching}
        onChange={setSearchText}
        className="mx-1 bg-gray-100"
      /> */}
      <ProductsUsersList productsUsers={productsWithUser} showUser={false} />
    </>
  )
}

export default ProductsLoggedUserContent
