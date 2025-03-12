import AddressPicker from '@components/AddressPicker'
import Button from '@components/Button'
import EventTagsChipsSelector from '@components/Chips/EventTagsChipsSelector'
import DirectionSelector from '@components/ComboBox/DirectionSelector'
import DateTimePicker from '@components/DateTimePicker'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormRow from '@components/FormRow'
import IconCheckBox from '@components/IconCheckBox'
import Input from '@components/Input'
import InputImages from '@components/InputImages'
import { SelectUser } from '@components/SelectItem'
import SubEvent from '@components/SubEvent'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons/faHeartBroken'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import {
  DEFAULT_EVENT,
  DEFAULT_SUBEVENT,
  DEFAULT_SUBEVENT_GENERATOR,
} from '@helpers/constants'
import formatMinutes from '@helpers/formatMinutes'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import getEventDuration from '@helpers/getEventDuration'
import isObject from '@helpers/isObject'
import subEventsSummator from '@helpers/subEventsSummator'
import useErrors from '@helpers/useErrors'
import modalsFuncAtom from '@state/modalsFuncAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventSelector from '@state/selectors/eventSelector'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { uid } from 'uid'
import { faComment as faCommentRegular } from '@fortawesome/free-regular-svg-icons/faComment'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
// import splitText from '@helpers/splitText'

const SubEvents = ({ subEvents, onChange, rules }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)

  const addItem = (props) => {
    const newItem = { ...(props ?? DEFAULT_SUBEVENT), id: uid(24) }
    onChange((state) => [...state, newItem])
  }

  const deleteItem = (id) =>
    onChange((state) => state.filter((item) => item.id !== id))

  const onItemChange = (id, keyValue) =>
    onChange((state) =>
      state.map((item) => (item.id === id ? { ...item, ...keyValue } : item))
    )

  const summary = subEventsSummator(subEvents)

  return (
    <div className="flex flex-col items-stretch">
      {subEvents?.map((props) => (
        <SubEvent
          key={props.id}
          onItemChange={onItemChange}
          deleteItem={subEvents?.length > 1 ? deleteItem : undefined}
          addItem={addItem}
          rules={rules}
          {...props}
        />
      ))}
      <Button
        name="Добавить вариант"
        icon={faPlus}
        onClick={() =>
          modalsFunc.event.subEventEdit(
            {
              ...DEFAULT_SUBEVENT,
              id: uid(24),
              title: `Вариант участия №${(subEvents?.length ?? 1) + 1}`,
            },
            addItem,
            rules
          )
        }
      />
      {subEvents?.length > 1 && <SubEvent {...summary} />}
    </div>
  )
}

const eventFunc = (eventId, clone = false, props = {}) => {
  const EventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const directions = useAtomValue(directionsAtom)
    const setEvent = useAtomValue(itemsFuncAtom).event.set
    const [directionId, setDirectionId] = useState(
      props?.directionId !== undefined
        ? props.directionId
        : (event?.directionId ?? DEFAULT_EVENT.directionId)
    )

    const defaultOrganizerId =
      props?.organizerId !== undefined
        ? props.organizerId
        : (event?.organizerId ?? useAtomValue(loggedUserActiveAtom)._id)
    const [organizerId, setOrganizerId] = useState(defaultOrganizerId)

    const [title, setTitle] = useState(
      props?.title !== undefined
        ? props.title
        : (event?.title ?? DEFAULT_EVENT.title)
    )
    const [images, setImages] = useState(
      props?.images !== undefined
        ? props.images
        : (event?.images ?? DEFAULT_EVENT.images)
    )
    const [description, setDescription] = useState(
      props?.description !== undefined
        ? props.description
        : (event?.description ?? DEFAULT_EVENT.description)
    )

    // const test = splitText(description)
    // console.log('test :>> ', test)

    const defaultTags = useMemo(
      () =>
        typeof props?.tags === 'object'
          ? props.tags
          : typeof event?.tags === 'object'
            ? event.tags.filter((tag) => tag)
            : [],
      []
    )
    const [tags, setTags] = useState(defaultTags)

    const defaultDateStart = useMemo(
      () =>
        props?.dateStart !== undefined
          ? props.dateStart
          : (event?.dateStart ?? Date.now() - (Date.now() % 3600000) + 3600000),
      []
    )

    const defaultDateEnd = useMemo(
      () =>
        props?.dateEnd !== undefined
          ? props.dateEnd
          : (event?.dateEnd ?? defaultDateStart + 3600000),
      []
    )

    const [dateStart, setDateStart] = useState(defaultDateStart)
    const [dateEnd, setDateEnd] = useState(defaultDateEnd)

    // const [duration, setDuration] = useState(
    //   event?.duration ?? DEFAULT_EVENT.duration
    // )

    const [address, setAddress] = useState(
      isObject(props?.address)
        ? props.address
        : isObject(event?.address)
          ? event.address
          : DEFAULT_EVENT.address
    )
    // const [price, setPrice] = useState(event?.price ?? DEFAULT_EVENT.price)
    const [subEvents, setSubEvents] = useState(
      props?.subEvents !== undefined
        ? props.subEvents
        : event?.subEvents
          ? event.subEvents
          : [DEFAULT_SUBEVENT_GENERATOR()]
    )

    const [showOnSite, setShowOnSite] = useState(
      props?.showOnSite !== undefined
        ? props.showOnSite
        : (event?.showOnSite ?? DEFAULT_EVENT.showOnSite)
    )
    const [reportImages, setReportImages] = useState(
      props?.reportImages !== undefined
        ? props.reportImages
        : (event?.reportImages ?? DEFAULT_EVENT.reportImages)
    )
    const [report, setReport] = useState(
      props?.report !== undefined
        ? props.report
        : (event?.report ?? DEFAULT_EVENT.report)
    )

    const [warning, setWarning] = useState(
      props?.warning !== undefined
        ? props.warning
        : (event?.warning ?? DEFAULT_EVENT.warning)
    )

    const [blank, setBlank] = useState(
      props?.blank !== undefined
        ? props.blank
        : (event?.blank ?? DEFAULT_EVENT.blank)
    )

    const [likes, setLikes] = useState(
      props?.likes !== undefined
        ? props.likes
        : (event?.likes ?? DEFAULT_EVENT.likes)
    )

    const direction = useMemo(
      () => directions.find(({ _id }) => _id === directionId),
      [directionId]
    )

    // const changeDirectionId = (id) => {
    //   const direction = directions.find(({ _id }) => _id === id)
    //   const rules = direction.rules
    //   if (rules && typeof rules === 'object') {
    //     if (rules?.userStatus) {
    //       setUsersStatusAccess((state) => {
    //         const novice = ['novice', 'any'].includes(rules.userStatus)
    //           ? true
    //           : rules.userStatus === 'member'
    //             ? false
    //             : state.novice
    //         const member = ['member', 'any'].includes(rules.userStatus)
    //           ? true
    //           : rules.userStatus === 'novice'
    //             ? false
    //             : state.member
    //         return { ...state, novice, member }
    //       })
    //     }
    //     if (rules?.userRelationship) {
    //       setUsersRelationshipAccess((state) => {
    //         if (rules.userRelationship === 'any') {
    //           return 'yes'
    //         }
    //         if (rules.userRelationship === 'alone') {
    //           return 'no'
    //         }
    //         if (rules.userRelationship === 'pair') {
    //           return 'only'
    //         }
    //         return state
    //       })
    //     }
    //   }
    //   setDirectionId(id)
    // }

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      let isErrorsExists = !blank
        ? checkErrors({
            title,
            description,
            images,
            directionId,
            organizerId,
            dateStart,
            dateEnd,
            tags,
          })
        : checkErrors({
            title,
            dateStart,
            dateEnd,
          })
      if (getDiffBetweenDates(dateStart, dateEnd) < 0) {
        addError({
          dateEnd: 'Дата завершения не может быть раньше даты начала',
        })
        isErrorsExists = true
      }
      if (!isErrorsExists) {
        closeModal()
        setEvent(
          {
            _id: event?._id,
            images: blank ? [] : images,
            title: title.trim(),
            description: blank ? '' : description,
            tags: blank ? [] : tags,
            showOnSite,
            dateStart,
            dateEnd,
            // duration,
            address: blank ? {} : address,
            // price,
            subEvents: blank ? [DEFAULT_SUBEVENT_GENERATOR()] : subEvents,
            directionId: blank ? null : directionId,
            ...(blank ? { status: 'active' } : {}),
            // maxParticipants: maxParticipantsCheck ? null : maxParticipants ?? 0,
            // maxMans: maxMansCheck ? null : maxMans ?? 0,
            // maxWomans: maxWomansCheck ? null : maxWomans ?? 0,
            // maxMansNovice: maxMansNoviceCheck ? null : maxMansNovice ?? 0,
            // maxWomansNovice: maxWomansNoviceCheck ? null : maxWomansNovice ?? 0,
            // maxMansMember: maxMansMemberCheck ? null : maxMansMember ?? 0,
            // maxWomansMember: maxWomansMemberCheck ? null : maxWomansMember ?? 0,
            // maxMansAge,
            // minMansAge,
            // maxWomansAge,
            // minWomansAge,
            organizerId,
            // status,
            // usersStatusAccess,
            // usersStatusDiscount,
            // usersRelationshipAccess,
            // isReserveActive,
            report: blank ? null : report,
            reportImages: blank ? [] : reportImages,
            warning: blank ? false : warning,
            likes: blank ? false : likes,
            blank,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        (props?.title !== undefined ? props.title : event?.title) !== title ||
        (props?.description !== undefined
          ? props.description
          : event?.description) !== description ||
        !compareArrays(defaultTags, tags) ||
        (props?.showOnSite !== undefined
          ? props.showOnSite
          : event?.showOnSite) !== showOnSite ||
        dateStart !== defaultDateStart ||
        dateEnd !== defaultDateEnd ||
        // event?.duration !== duration ||
        !compareArrays(
          props?.images !== undefined ? props.images : event?.images,
          images
        ) ||
        !compareObjects(
          props?.address !== undefined ? props.address : event?.address,
          address
        ) ||
        // event?.price !== price ||
        !compareObjects(
          props?.subEvents !== undefined ? props.subEvents : event?.subEvents,
          subEvents
        ) ||
        (props?.directionId !== undefined
          ? props.directionId
          : event?.directionId) !== directionId ||
        // event?.maxParticipants !==
        //   (maxParticipantsCheck ? null : maxParticipants ?? 0) ||
        // event?.maxMans !== (maxMansCheck ? null : maxMans ?? 0) ||
        // event?.maxWomans !== (maxWomansCheck ? null : maxWomans ?? 0) ||
        // event?.maxMansNovice !==
        //   (maxMansNoviceCheck ? null : maxMansNovice ?? 0) ||
        // event?.maxWomansNovice !==
        //   (maxWomansNoviceCheck ? null : maxWomansNovice ?? 0) ||
        // event?.maxMansMember !==
        //   (maxMansMemberCheck ? null : maxMansMember ?? 0) ||
        // event?.maxWomansMember !==
        //   (maxWomansMemberCheck ? null : maxWomansMember ?? 0) ||
        // event?.minMansAge !== minMansAge ||
        // event?.maxMansAge !== maxMansAge ||
        // event?.minWomansAge !== minWomansAge ||
        // event?.maxWomansAge !== maxWomansAge ||
        organizerId !== defaultOrganizerId ||
        // event?.status !== status ||
        // !compareObjects(defaultUsersStatusAccess, usersStatusAccess) ||
        // !compareObjects(defaultUsersStatusDiscount, usersStatusDiscount) ||
        // event?.usersRelationshipAccess !== usersRelationshipAccess ||
        // event?.isReserveActive !== isReserveActive ||
        (props?.report !== undefined ? props.report : event?.report) !==
          report ||
        !compareArrays(
          props?.reportImages !== undefined
            ? props.reportImages
            : event?.reportImages,
          reportImages
        ) ||
        (props?.warning !== undefined ? props.warning : event?.warning) !==
          warning ||
        (props?.likes !== undefined ? props.likes : event?.likes) !== likes ||
        (props?.blank !== undefined ? props.blank : event?.blank) !== blank

      // setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
    }, [
      title,
      description,
      tags,
      showOnSite,
      dateStart,
      dateEnd,
      // duration,
      images,
      address,
      // price,
      subEvents,
      directionId,
      // maxParticipants,
      // maxMans,
      // maxWomans,
      // maxMansNovice,
      // maxWomansNovice,
      // maxMansMember,
      // maxWomansMember,
      // maxMansAge,
      // minMansAge,
      // maxWomansAge,
      // minWomansAge,
      organizerId,
      // maxParticipantsCheck,
      // maxMansCheck,
      // maxWomansCheck,
      // maxMansNoviceCheck,
      // maxWomansNoviceCheck,
      // maxMansMemberCheck,
      // maxWomansMemberCheck,
      // status,
      // usersStatusAccess,
      // usersStatusDiscount,
      // usersRelationshipAccess,
      // isReserveActive,
      report,
      reportImages,
      warning,
      likes,
      blank,
      props,
    ])

    const duration = getEventDuration({ dateStart, dateEnd })

    const WarningAccess = () =>
      (direction?.rules?.userStatus &&
        direction?.rules?.userStatus !== 'select') ||
      (direction?.rules?.userRelationship &&
        direction?.rules?.userRelationship !== 'select') ? (
        <div className="pl-2 -mb-2 text-sm text-danger">
          Применены ограничения доступа заданные направлением
        </div>
      ) : null

    return (
      <>
        <TabContext value="Общие">
          <TabPanel tabName="Общие" className="px-0">
            {/* <FormWrapper> */}
            <IconCheckBox
              checked={blank}
              onClick={() => setBlank((checked) => !checked)}
              label="Пустое мероприятие (отображается в виде текста между мероприятиями)"
              checkedIcon={faComment}
              uncheckedIcon={faCommentRegular}
              checkedIconColor="#0000AA"
              big
            />
            {!blank && (
              <>
                <InputImages
                  label="Фотографии"
                  directory="events"
                  images={images}
                  onChange={(images) => {
                    removeError('images')
                    setImages(images)
                  }}
                  required
                  error={errors.images}
                />
                <DirectionSelector
                  value={directionId}
                  onChange={(directionId) => {
                    removeError('directionId')
                    // changeDirectionId(directionId)
                    setDirectionId(directionId)
                  }}
                  required
                  error={errors.directionId}
                />
                <WarningAccess />
              </>
            )}
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
              required
            />
            {!blank && (
              <>
                <EditableTextarea
                  label="Описание"
                  html={description}
                  onChange={(value) => {
                    removeError('description')
                    setDescription(value)
                  }}
                  required
                  error={errors.description}
                />
                <EventTagsChipsSelector
                  tags={tags}
                  onChange={(value) => {
                    removeError('tags')
                    setTags(value)
                  }}
                  canEditChips
                  required
                  error={errors.tags}
                  // readOnly
                  // className
                />
              </>
            )}
            {/* <FormWrapper twoColumns> */}
            <FormRow className="flex-wrap">
              <DateTimePicker
                value={dateStart}
                onChange={(date) => {
                  removeError('dateStart')
                  setDateStart(date)
                }}
                label="Начало"
                required
                error={errors.dateStart}
                noMargin
                // postfix={
                //   getDiffBetweenDates(dateStart) > 0 && 'Внимание: дата прошла!'
                // }
                // postfixClassName="text-danger"
              />
              {getDiffBetweenDates(dateStart) > 0 && (
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0 text-danger">
                  Внимание: дата прошла!
                </div>
              )}
            </FormRow>
            <FormRow>
              <DateTimePicker
                value={dateEnd}
                onChange={(date) => {
                  removeError('dateEnd')
                  setDateEnd(date)
                }}
                label="Завершение"
                required
                error={errors.dateEnd}
                noMargin
                // postfix={formatMinutes(duration)}
              />
              <div className="flex items-center pt-[4px] leading-3 laptop:pt-0">
                {formatMinutes(duration)}
              </div>
            </FormRow>
            {/* <TimePicker
                  value={
                    formatMinutes(duration, true)
                    // (Math.ceil(duration / 60) <= 9
                    //   ? '0' + Math.ceil(duration / 60)
                    //   : Math.ceil(duration / 60)) +
                    // ':' +
                    // (duration % 60 <= 9 ? '0' + (duration % 60) : duration % 60)
                  }
                  onChange={(duration) => {
                    removeError('duration')
                    setDuration(
                      duration
                        .split(':')
                        .reduce((seconds, v) => +v + seconds * 60, 0)
                    )
                  }}
                  label="Продолжительность"
                  required
                  error={errors.duration}
                /> */}
            {/* </FormWrapper> */}
            {!blank && (
              <>
                <SelectUser
                  label="Организатор"
                  modalTitle="Выбор организатора"
                  selectedId={organizerId}
                  onChange={(userId) => {
                    removeError('organizerId')
                    setOrganizerId(userId)
                  }}
                  required
                  error={errors.organizerId}
                />
                <AddressPicker address={address} onChange={setAddress} />
                {/* <CheckBox
              checked={warning}
              labelPos="left"
              // labelClassName="w-40"
              onClick={() => setWarning((checked) => !checked)}
              label="Предупреждение о рисках и травмоопасности на мероприятии"
            /> */}
                <IconCheckBox
                  checked={warning}
                  onClick={() => setWarning((checked) => !checked)}
                  label="Предупреждение о рисках и травмоопасности на мероприятии"
                  checkedIcon={faTriangleExclamation}
                  checkedIconColor="#AA0000"
                  big
                />

                <IconCheckBox
                  checked={showOnSite}
                  onClick={() => setShowOnSite((checked) => !checked)}
                  label="Показывать на сайте"
                  checkedIcon={faEye}
                  uncheckedIcon={faEyeSlash}
                  checkedIconColor="#A855F7"
                  big
                />
                <IconCheckBox
                  checked={likes}
                  onClick={() => setLikes((checked) => !checked)}
                  label="Участники ставят лайки другим участникам во время и после мероприятия"
                  checkedIcon={faHeart}
                  uncheckedIcon={faHeartBroken}
                  checkedIconColor="#EC4899"
                  big
                />
              </>
            )}
          </TabPanel>
          {!blank && (
            <TabPanel tabName="Варианты участия" className="px-0">
              <WarningAccess />
              <SubEvents
                subEvents={subEvents}
                onChange={setSubEvents}
                rules={direction?.rules}
              />
            </TabPanel>
          )}
        </TabContext>
        <ErrorsList errors={errors} />
      </>
    )
  }

  return {
    title: `${eventId && !clone ? 'Редактирование' : 'Создание'} мероприятия`,
    confirmButtonName: eventId && !clone ? 'Применить' : 'Создать',
    Children: EventModal,
  }
}

export default eventFunc
