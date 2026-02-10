import Button from '@components/Button'
import ProductCardButtons from '@components/cardButtons/ProductCardButtons'
import Divider from '@components/Divider'
import ImageGallery from '@components/ImageGallery'
import NoOrphanText from '@components/NoOrphanText'
import PriceDiscount from '@components/PriceDiscount'
import TextLine from '@components/TextLine'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import productSelector from '@state/selectors/productSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'

const CardButtonsComponent = ({ product }) => (
  <ProductCardButtons item={product} forForm />
)

const productViewFunc = (productId) => {
  const ProductViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const product = useAtomValue(productSelector(productId))
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const isLoggedUserDev = loggedUserActiveRole?.dev
    const canEdit = loggedUserActiveRole?.products?.edit

    useEffect(() => {
      if (canEdit && setTopLeftComponent)
        setTopLeftComponent(() => <CardButtonsComponent product={product} />)
    }, [product, canEdit, setTopLeftComponent])

    if (!product || !productId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Товар не найден!
        </div>
      )

    return (
      <div className="flex flex-col gap-y-2">
        <ImageGallery images={product?.images} />
        <div className="flex flex-col flex-1">
          <div className="relative flex flex-col flex-1 w-full max-w-full px-2 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {product?.title}
            </div>
            {!setTopLeftComponent && canEdit && (
              <div className="absolute right-0">
                <CardButtonsComponent product={product} />
              </div>
            )}
            <NoOrphanText
              as="div"
              className="w-full max-w-full overflow-hidden list-disc ql textarea"
              html={DOMPurify.sanitize(product?.description)}
            />

            {isLoggedUserDev && (
              <>
                <Divider thin light />
                <TextLine label="ID">{product?._id}</TextLine>
              </>
            )}
          </div>
          <Divider thin light />
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
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
                onClick={() => modalsFunc.product.apply(productId)}
                thin
                roundedFull
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Товар`,
    confirmButtonName: 'Приобрести',
    Children: ProductViewModal,
  }
}

export default productViewFunc
