import Button from '@components/Button'
import ProductCardButtons from '@components/cardButtons/ProductCardButtons'
import CardWrapper from '@components/CardWrapper'
import NoOrphanText from '@components/NoOrphanText'
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
      onClick={() => modalsFunc.product.view(product._id)}
      showOnSite={product.showOnSite}
      hidden={hidden}
      style={style}
      className="rounded-[22px] border border-[rgba(107,31,42,0.16)] shadow-[0_16px_30px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
      outerClassName="px-3 py-2"
    >
      {product?.images && product.images[0] && (
        <div className="flex justify-center w-32 p-2 min-w-32 tablet:min-w-40 tablet:w-40 max-h-48 tablet:max-h-56">
          <img
            className="object-cover w-full h-full rounded-[16px] border border-[#f0e5ea] bg-white/80"
            src={product.images[0]}
            alt="product"
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex items-center pl-4 pr-2 py-1 laptop:rounded-bl-[22px] laptop:rounded-tr-[22px] bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.12))]">
          <TextLinesLimiter
            className="flex-1 text-lg font-bold text-[#4b0f1c]"
            lines={1}
            textCenter={false}
          >
            {product?.title ?? '[неизвестный товар]'}
          </TextLinesLimiter>
          <ProductCardButtons
            item={product}
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
        <NoOrphanText
          as="div"
          className="flex-1 w-full max-w-full px-2 pb-1 overflow-hidden text-sm text-[#3a2c33] whitespace-pre-wrap"
          text={product.shortDescription}
        />
        <div className="flex items-center justify-between px-2 py-1 text-lg font-bold border-t border-[#f0e5ea] gap-x-2 flex-nowrap">
          <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
            <PriceDiscount
              item={product}
              className="font-futura font-semibold text-[18px] text-[#6b1f2a]"
            />
          </div>
          {typeof modalsFunc?.product?.apply === 'function' && (
            <Button
              name="Приобрести"
              stopPropagation
              onClick={() => modalsFunc.product.apply(product._id)}
              thin
              roundedFull
            />
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ProductCard
