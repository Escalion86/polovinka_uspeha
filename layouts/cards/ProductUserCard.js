import ProductUserCardButtons from '@components/cardButtons/ProductUserCardButtons'
import CardWrapper from '@components/CardWrapper'
import { UserItem } from '@components/ItemCards'
import PriceDiscount from '@components/PriceDiscount'
import TextLinesLimiter from '@components/TextLinesLimiter'
import formatDateTime from '@helpers/formatDateTime'
import modalsFuncAtom from '@state/modalsFuncAtom'
import errorAtom from '@state/atoms/errorAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import productSelector from '@state/selectors/productSelector'
import productsUsersSelector from '@state/selectors/productsUsersSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

const ProductUserCardView = ({
  productUser,
  user,
  productUserId,
  hidden = false,
  style,
  showUser,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)

  if (!productUser) return null

  const loading = useAtomValue(loadingAtom('productsUser' + productUserId))
  const error = useAtomValue(errorAtom('productsUser' + productUserId))
  const product = useAtomValue(productSelector(productUser.productId))

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() => !loading && modalsFunc.productUser.view(productUserId)}
      gap={false}
      hidden={hidden}
      style={style}
      outerClassName="px-3 py-2"
      className="rounded-[24px] border border-[rgba(107,31,42,0.16)] shadow-[0_14px_28px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
    >
      <div className={cn('flex flex-col w-full h-full overflow-hidden')}>
        <div className="flex items-center w-full px-4 py-2 bg-[linear-gradient(135deg,rgba(107,31,42,0.1),rgba(79,176,232,0.16))]">
          <TextLinesLimiter
            className="flex-1 text-base font-bold tablet:text-lg text-[#4b0f1c]"
            lines={1}
            textCenter={false}
          >
            {product?.title ?? '[неизвестный товар]'}
          </TextLinesLimiter>
          <ProductUserCardButtons item={productUser} />
        </div>

        {showUser && (
          <div className="flex-1 border-t border-[#f0e5ea]">
            <UserItem item={user} userId={productUser.userId} />
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#f0e5ea] gap-x-2">
          {product && (
            <>
              <div className="flex-1 text-xs font-semibold text-[#6b1f2a]/70">
                {formatDateTime(productUser?.createdAt)}
              </div>
              <div className="flex items-center gap-x-2">
                {productUser.status === 'closed' ? (
                  <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-700">
                    ИСПОЛНЕНО
                  </span>
                ) : productUser.status === 'canceled' ? (
                  <span className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-700">
                    ОТМЕНЕНО
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-700">
                    АКТИВНО
                  </span>
                )}
              </div>
              {user && (
                <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
                  <PriceDiscount item={product} priceForStatus={user.status} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

const ProductUserCardFromStore = (props) => {
  const productUser = useAtomValue(productsUsersSelector(props.productUserId))
  if (!productUser) return null
  const user = useAtomValue(userSelector(productUser.userId))
  return (
    <ProductUserCardView {...props} productUser={productUser} user={user} />
  )
}

const ProductUserCard = ({ productUser, user, ...props }) => {
  if (productUser) {
    return (
      <ProductUserCardView
        {...props}
        productUser={productUser}
        productUserId={productUser._id}
        user={user ?? productUser.user}
      />
    )
  }
  return <ProductUserCardFromStore {...props} />
}

export default ProductUserCard
