import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import { DEFAULT_DIRECTION } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import directionSelector from '@state/selectors/directionSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import ComboBox from '@components/ComboBox'
import compareObjects from '@helpers/compareObjects'
import CardButtons from '@components/CardButtons'

const directionFunc = (directionId, clone = false) => {
  const DirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
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
    // const [image, setImage] = useState(
    //   direction?.image ?? DEFAULT_DIRECTION.image
    // )
    const [showOnSite, setShowOnSite] = useState(
      direction?.showOnSite ?? DEFAULT_DIRECTION.showOnSite
    )

    // const defaultPlugins = direction?.plugins ?? DEFAULT_DIRECTION.plugins

    // const [plugins, setPlugins] = useState(defaultPlugins)

    // const setStatePlugins = (key, value) =>
    //   setPlugins((state) => ({ ...state, [key]: value }))

    const defaultRules = {
      ...DEFAULT_DIRECTION.rules,
      ...direction?.rules,
    }

    const [rules, setRules] = useState(defaultRules)

    const setRule = (key, value) =>
      setRules((state) => {
        const tempState = { ...state }
        tempState[key] = value
        return tempState
      })

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
            // image,
            rules,
            // plugins,
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
        // || direction?.image !== image
        !compareObjects(defaultRules, rules)
      // || !compareObjects(defaultPlugins, plugins)

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      title,
      shortDescription,
      description,
      showOnSite,
      // image,
      rules,
      // plugins,
    ])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={direction}
            typeOfItem="direction"
            forForm
            showEditButton={false}
            showDeleteButton={false}
          />
        ))
    }, [setTopLeftComponent])

    return (
      <TabContext value="Общие">
        <TabPanel tabName="Общие" className="px-0">
          <FormWrapper>
            {/* <InputImage
          label="Картинка"
          directory="directions"
          image={image}
          onChange={setImage}
          aspect={1}
        /> */}
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
        </TabPanel>
        <TabPanel tabName="Доступ" className="px-0">
          <ComboBox
            label="По статусу участника на проекте"
            // className="w-[108px]"
            items={[
              { value: 'select', name: 'Можно выбрать  в мероприятии' },
              { value: 'any', name: 'Всегда для всех' },
              { value: 'novice', name: 'Всегда только центру' },
              { value: 'member', name: 'Всегда только клубным' },
            ]}
            value={rules.userStatus}
            onChange={(value) => setRule('userStatus', value)}
            paddingY="small"
            fullWidth={false}
          />
          <ComboBox
            label="По статусу отношений участника"
            // className="w-[108px]"
            items={[
              { value: 'select', name: 'Можно выбрать в мероприятии' },
              { value: 'any', name: 'Всегда для всех' },
              { value: 'alone', name: 'Всегда только одиноким' },
              { value: 'pair', name: 'Всегда только парам' },
            ]}
            value={rules.userRelationship}
            onChange={(value) => setRule('userRelationship', value)}
            paddingY="small"
            fullWidth={false}
          />
        </TabPanel>
      </TabContext>
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
