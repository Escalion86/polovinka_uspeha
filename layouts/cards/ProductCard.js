import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import PriceDiscount from '@components/PriceDiscount'
import TextLinesLimiter from '@components/TextLinesLimiter'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import productsAtom from '@state/atoms/productsAtom'
import productSelector from '@state/selectors/productSelector'
import { useAtomValue } from 'jotai'

const ProductCard = ({ productId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const product = useAtomValue(productSelector(productId))
  const loading = useAtomValue(loadingAtom('product' + productId))
  const itemFunc = useAtomValue(itemsFuncAtom)
  const products = useAtomValue(productsAtom)

  const setUp = async () => {
    if (product.index === 0) return

    let movedUp = false
    let movedDown = false
    const itemsToChange = products.map((item) => {
      if (item.index === product.index)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }

      if (item.index === product.index - 1)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.product.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  const setDown = async () => {
    if (product.index >= products.length - 1) return

    let movedUp = false
    let movedDown = false
    const itemsToChange = products.map((item) => {
      if (item.index === product.index)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
      if (item.index === product.index + 1)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.product.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.product.edit(product._id)}
      showOnSite={product.showOnSite}
      hidden={hidden}
      style={style}
    >
      {product?.images && product.images[0] && (
        <div className="flex justify-center w-36 min-w-36 tablet:min-w-48 tablet:w-48 max-h-60 tablet:max-h-72">
          <img
            className="object-cover w-full h-full"
            src={product.images[0]}
            alt="product"
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex">
          <TextLinesLimiter
            className="flex-1 px-2 py-1 text-xl font-bold"
            lines={1}
            textCenter={false}
          >
            {product?.title ?? '[неизвестный товар]'}
          </TextLinesLimiter>
          <CardButtons
            item={product}
            typeOfItem="product"
            showOnSiteOnClick={() => {
              itemFunc.product.set({
                _id: product._id,
                showOnSite: !product.showOnSite,
              })
            }}
            onUpClick={product.index > 0 && setUp}
            onDownClick={product.index < products.length - 1 && setDown}
          />
        </div>
        <div className="flex-1 w-full max-w-full px-2 pb-1 overflow-hidden text-sm whitespace-pre-wrap">
          {product.shortDescription}
        </div>
        <div className="flex items-center justify-between px-2 py-1 text-lg font-bold border-t gap-x-2 flex-nowrap">
          <PriceDiscount item={product} className="flex-1" />
        </div>
      </div>
    </CardWrapper>
  )
}

export default ProductCard
