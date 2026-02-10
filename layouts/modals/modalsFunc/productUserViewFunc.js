import CardButton from '@components/CardButton'
import PriceDiscount from '@components/PriceDiscount'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import formatDateTime from '@helpers/formatDateTime'
import modalsFuncAtom from '@state/modalsFuncAtom'
import productSelector from '@state/selectors/productSelector'
import productsUsersSelector from '@state/selectors/productsUsersSelector'
import userSelector from '@state/selectors/userSelector'
import { useAtomValue } from 'jotai'

const productUserViewFunc = (
  productUserId,
  showQuestionnaireOnly = false,
  title
) => {
  const ProductUserViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const productUser = useAtomValue(productsUsersSelector(productUserId))

    const modalsFunc = useAtomValue(modalsFuncAtom)
    const user = useAtomValue(userSelector(productUser.userId))
    const product = useAtomValue(productSelector(productUser.productId))

    if (!productUser || !productUserId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Заявка на товар не найдена!
        </div>
      )

    return (
      <div className="flex flex-col gap-y-1">
        {!showQuestionnaireOnly && (
          <>
            <TextLine label="Дата заявки">
              {formatDateTime(productUser?.createdAt)}
            </TextLine>
            <TextLine label="Товар">
              {product.title}
              <CardButton
                icon={faEye}
                color="orange"
                onClick={() => modalsFunc.product.view(product._id)}
                paddingY={false}
              />
            </TextLine>
            <TextLine label="Стоимсоть">
              <PriceDiscount item={product} priceForStatus={user.status} />
            </TextLine>
            <TextLine label="Покупатель">
              <UserName user={user} noWrap />
              <CardButton
                icon={faEye}
                color="orange"
                onClick={() => modalsFunc.user.view(user._id)}
                paddingY={false}
              />
            </TextLine>
            {productUser.comment && (
              <TextLine label="Комментарий">{productUser.comment}</TextLine>
            )}
          </>
        )}
        {/* Анкеты у товаров отсутствуют */}
      </div>
    )
  }

  return {
    title: title ?? `Заявка на товар`,
    // confirmButtonName: 'Подать заявку',
    Children: ProductUserViewModal,
  }
}

export default productUserViewFunc
