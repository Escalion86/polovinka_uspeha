'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounProducts } from '@helpers/getNoun'
import ProductCard from '@layouts/cards/ProductCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import productsAtom from '@state/atoms/productsAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtomValue } from 'jotai'

const ProductsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const products = useAtomValue(productsAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const seeHidden = loggedUserActiveRole?.products?.seeHidden
  const addButton = loggedUserActiveRole?.products?.add

  const filteredProducts = seeHidden
    ? products
    : products.filter(({ showOnSite }) => showOnSite)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounProducts(filteredProducts?.length)}
          </div>
          {addButton && <AddButton onClick={() => modalsFunc.product.edit()} />}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {filteredProducts?.length > 0 ? (
          [...filteredProducts]
            .sort((a, b) => (a.index < b.index ? -1 : 1))
            .map((product) => (
              <ProductCard key={product._id} productId={product._id} />
            ))
        ) : (
          <div className="flex justify-center p-2">Нет товаров</div>
        )}
      </CardListWrapper>
    </>
  )
}

export default ProductsContent
