import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import { DEFAULT_DIRECTION } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import directionSelector from '@state/selectors/directionSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const directionFunc = (directionId, clone = false) => {
  const DirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const direction = useRecoilValue(directionSelector(directionId))
    const setDirection = useRecoilValue(itemsFuncAtom).direction.set

    const [title, setTitle] = useState(
      direction?.title ?? DEFAULT_DIRECTION.title
    )
    const [shortDescription, setShortDescription] = useState(
      direction?.shortDescription ?? DEFAULT_DIRECTION.shortDescription
    )
    const [description, setDescription] = useState(
      direction?.description ?? DEFAULT_DIRECTION.description
    )
    const [image, setImage] = useState(
      direction?.image ?? DEFAULT_DIRECTION.image
    )
    const [showOnSite, setShowOnSite] = useState(
      direction?.showOnSite ?? DEFAULT_DIRECTION.showOnSite
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      if (!checkErrors({ title, shortDescription, description })) {
        closeModal()
        setDirection(
          {
            _id: direction?._id,
            title,
            description,
            shortDescription,
            showOnSite,
            image,
          },
          clone
        )
        // if (direction && !clone) {
        //   await putData(
        //     `/api/directions/${direction._id}`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/directions`,
        //     {
        //       title,
        //       description,
        //       showOnSite,
        //       image,
        //     },
        //     refreshPage
        //   )
        // }
      }
    }

    useEffect(() => {
      const isFormChanged =
        direction?.title !== title ||
        direction?.description !== description ||
        direction?.shortDescription !== shortDescription ||
        direction?.showOnSite !== showOnSite ||
        direction?.image !== image

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [title, shortDescription, description, showOnSite, image])

    return (
      <FormWrapper>
        <InputImage
          label="Картинка"
          directory="directions"
          image={image}
          onChange={setImage}
          aspect={1}
        />
        <Input
          label="Название"
          type="text"
          value={title}
          onChange={(value) => {
            removeError('title')
            setTitle(value)
          }}
          // labelClassName="w-40"
          error={errors.title}
        />
        {/* <Input
          label="Описание"
          value={description}
          onChange={(e) => {
            removeError('description')
            setDescription(e.target.value)
          }}
          labelClassName="w-40"
          error={errors.description}
        /> */}
        <Textarea
          label="Короткое описание"
          onChange={(value) => {
            removeError('shortDescription')
            setShortDescription(value)
          }}
          value={shortDescription}
          error={errors.shortDescription}
          rows={3}
          required
        />
        <EditableTextarea
          label="Описание"
          html={description}
          uncontrolled={false}
          onChange={(value) => {
            removeError('description')
            setDescription(value)
          }}
          error={errors.description}
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      directionId && !clone ? 'Редактирование' : 'Создание'
    } направления`,
    confirmButtonName: directionId && !clone ? 'Применить' : 'Создать',
    Children: DirectionModal,
  }
}

export default directionFunc
