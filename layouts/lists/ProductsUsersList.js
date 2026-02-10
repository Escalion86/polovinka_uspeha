// import ProductUserCard from '@layouts/cards/ProductUserCard'
import dynamic from 'next/dynamic'
const ProductUserCard = dynamic(() => import('@layouts/cards/ProductUserCard'))
import ListWrapper from './ListWrapper'

const ProductsUsersList = ({ productsUsers, showUser = true }) => {
  return (
    <ListWrapper
      itemCount={productsUsers.length}
      itemSize={showUser ? 156 : 108}
      wrapperClassName="bg-general/15"
      itemKey={(index) => productsUsers[index]?._id ?? index}
    >
      {({ index, style }) => (
        <ProductUserCard
          style={style}
          key={productsUsers[index]._id}
          productUser={productsUsers[index]}
          showUser={showUser}
        />
      )}
    </ListWrapper>
  )
}

export default ProductsUsersList
