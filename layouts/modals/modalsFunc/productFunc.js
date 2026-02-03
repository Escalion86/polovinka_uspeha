import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import PriceInput from '@components/PriceInput'
import Textarea from '@components/Textarea'
import compareArrays from '@helpers/compareArraysWithDif'
import {
  DEFAULT_PRODUCT,
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/itemsFuncAtom'
import productsAtom from '@state/atoms/productsAtom'
import productSelector from '@state/selectors/productSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

const productFunc = (productId, clone = false) => {
  const ProductModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
  }) => {
    const products = useAtomValue(productsAtom)
    const product = useAtomValue(productSelector(productId))
    const setProduct = useAtomValue(itemsFuncAtom).product.set

    const [title, setTitle] = useState(
      product?.title ?? DEFAULT_PRODUCT.title
    )
    const [description, setDescription] = useState(
      product?.description ?? DEFAULT_PRODUCT.description
    )
    const [shortDescription, setShortDescription] = useState(
      product?.shortDescription ?? DEFAULT_PRODUCT.shortDescription
    )
    const [images, setImages] = useState(
      product?.images ?? DEFAULT_PRODUCT.images
    )
    const [menuName, setMenuName] = useState(
      product?.menuName ?? DEFAULT_PRODUCT.menuName
    )
    const [showOnSite, setShowOnSite] = useState(
      product?.showOnSite ?? DEFAULT_PRODUCT.showOnSite
    )
    const [price, setPrice] = useState(
      product?.price ?? DEFAULT_PRODUCT.price
    )
    const defaultUsersStatusAccess = {
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...product?.usersStatusAccess,
    }
    const [usersStatusAccess, setUsersStatusAccess] = useState(
      defaultUsersStatusAccess
    )

    const defaultUsersStatusDiscount = {
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(product?.usersStatusDiscount ?? DEFAULT_PRODUCT.usersStatusDiscount),
    }
    const [usersStatusDiscount, setUsersStatusDiscount] = useState(
      defaultUsersStatusDiscount
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (!checkErrors({ title, description, shortDescription, images })) {
        closeModal()
        setProduct(
          {
            _id: product?._id,
            title,
            shortDescription,
            description,
            showOnSite,
            images,
            menuName,
            index: product?.index ?? products?.length ?? 0,
            price,
            usersStatusAccess,
            usersStatusDiscount,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        product?.title !== title ||
        product?.description !== description ||
        product?.shortDescription !== shortDescription ||
        product?.showOnSite !== showOnSite ||
        !compareArrays(product?.images, images) ||
        product?.menuName !== menuName ||
        product?.price !== price ||
        JSON.stringify(defaultUsersStatusAccess) !==
          JSON.stringify(usersStatusAccess) ||
        JSON.stringify(defaultUsersStatusDiscount) !==
          JSON.stringify(usersStatusDiscount)

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      title,
      shortDescription,
      description,
      showOnSite,
      images,
      menuName,
      price,
      usersStatusAccess,
      usersStatusDiscount,
    ])

    return (
      <>
        <FormWrapper>
          <InputImages
            label="Фотографии"
            directory="products"
            images={images}
            onChange={(nextImages) => {
              removeError('images')
              setImages(nextImages)
            }}
            required
            error={errors.images}
          />
          <Input
            label="Название"
            type="text"
            value={title}
            onChange={(value) => {
              removeError('title')
              setTitle(value)
            }}
            error={errors.title}
            required
          />
          <Textarea
            label="Короткое описание (для карточки)"
            value={shortDescription}
            onChange={(value) => {
              removeError('shortDescription')
              setShortDescription(value)
            }}
            error={errors.shortDescription}
            required
          />
          <EditableTextarea
            label="Описание"
            html={description}
            onChange={(value) => {
              removeError('description')
              setDescription(value)
            }}
            error={errors.description}
            required
          />
          <PriceInput
            value={price}
            onChange={(value) => {
              removeError('price')
              setPrice(value)
            }}
            error={errors.price}
          />
          <Input
            label="Название в меню"
            type="text"
            value={menuName}
            onChange={(value) => {
              removeError('menuName')
              setMenuName(value)
            }}
            error={errors.menuName}
          />
          <CheckBox
            checked={showOnSite}
            labelPos="left"
            onClick={() => setShowOnSite((checked) => !checked)}
            label="Показывать на сайте"
          />
        </FormWrapper>
        <ErrorsList errors={errors} />
      </>
    )
  }

  return {
    title: `${productId && !clone ? 'Редактирование' : 'Создание'} товара`,
    confirmButtonName: productId && !clone ? 'Применить' : 'Создать',
    Children: ProductModal,
  }
}

export default productFunc
