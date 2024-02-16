import AddressPicker from '@components/AddressPicker'
import Ages from '@components/Ages'
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
import InputWrapper from '@components/InputWrapper'
import { SelectUser } from '@components/SelectItem'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import UserStatusIcon from '@components/UserStatusIcon'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faHeart,
  faHeartBroken,
  faInfinity,
  faMars,
  faPlus,
  faTrash,
  faTriangleExclamation,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import {
  DEFAULT_EVENT,
  DEFAULT_SUBEVENT,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import formatMinutes from '@helpers/formatMinutes'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import getEventDuration from '@helpers/getEventDuration'
import isObject from '@helpers/isObject'
import subEventsSummator from '@helpers/subEventsSummator'
import useErrors from '@helpers/useErrors'
import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventSelector from '@state/selectors/eventSelector'
import cn from 'classnames'
import Image from 'next/legacy/image'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import SvgSigma from 'svg/SvgSigma'
import { uid } from 'uid'

const SubEvent = ({ onItemChange, deleteItem, addItem, ...props }) => {
  const modalFunc = useRecoilValue(modalsFuncAtom)
  const { id } = props

  return (
    <InputWrapper
      label={props.title}
      paddingX="small"
      paddingY={false}
      centerLabel
      className="relative"
    >
      <div
        className={cn(
          'flex items-center w-full pb-2 pt-3 gap-x-1',
          onItemChange ? 'cursor-pointer' : ''
        )}
        onClick={
          id && onItemChange
            ? () =>
                modalFunc.event.subEventEdit(props, (data) =>
                  onItemChange(id, data)
                )
            : undefined
        }
      >
        {id && (deleteItem || addItem) && (
          <div className="absolute flex items-center bg-white rounded-full gap-x-1 right-1 -top-3">
            {addItem && (
              <div className="bg-white rounded-full">
                <FontAwesomeIcon
                  className="h-6 p-1 text-blue-500 duration-300 cursor-pointer hover:scale-125"
                  icon={faCopy}
                  onClick={(e) => {
                    e.stopPropagation()
                    modalFunc.event.subEventEdit(props, addItem)
                  }}
                />
              </div>
            )}
            {deleteItem && (
              <div className="bg-white rounded-full">
                <FontAwesomeIcon
                  className="h-6 p-1 text-red-700 duration-300 cursor-pointer hover:scale-125"
                  icon={faTrash}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(id)
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col text-sm gap-x-1 laptop:text-base">
          <div className="flex gap-x-0.5 items-center">
            <UserStatusIcon size="xs" status="novice" />
            <div className="text-center min-w-20 whitespace-nowrap">
              {props.usersStatusDiscountResult?.noviceFrom && 'от '}
              {Math.floor(
                (typeof props.usersStatusDiscountResult?.novice === 'number'
                  ? props.usersStatusDiscountResult.novice
                  : (props.price ?? 0) -
                    (props.usersStatusDiscount?.novice ?? 0)) / 100
              )}{' '}
              ₽
            </div>
          </div>
          <div className="flex gap-x-0.5 items-center">
            <UserStatusIcon size="xs" status="member" />
            <div className="text-center min-w-20 whitespace-nowrap">
              {props.usersStatusDiscountResult?.memberFrom && 'от '}
              {Math.floor(
                (typeof props.usersStatusDiscountResult?.member === 'number'
                  ? props.usersStatusDiscountResult.member
                  : (props.price ?? 0) -
                    (props.usersStatusDiscount?.member ?? 0)) / 100
              )}{' '}
              ₽
            </div>
          </div>
        </div>
        <LimitsAndAge {...props} />
        {props.usersRelationshipAccess &&
          props.usersRelationshipAccess !== 'yes' && (
            <div className="absolute bg-white rounded-full left-1 -top-3">
              <UserRelationshipIcon
                relationship={props.usersRelationshipAccess === 'only'}
                nameForEvent
                size="s"
              />
            </div>
          )}
      </div>
    </InputWrapper>
  )
}

const SubEvents = ({ subEvents, onChange }) => {
  const modalFunc = useRecoilValue(modalsFuncAtom)

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
          {...props}
        />
      ))}
      <Button
        name="Добавить вариант"
        icon={faPlus}
        onClick={() =>
          modalFunc.event.subEventEdit(
            {
              ...DEFAULT_SUBEVENT,
              id: uid(24),
              title: `Вариант участия №${(subEvents?.length ?? 1) + 1}`,
            },
            addItem
          )
        }
      />
      {subEvents?.length > 1 && <SubEvent {...summary} />}
    </div>
  )
}
const Infinity = () => (
  <FontAwesomeIcon icon={faInfinity} className="w-4 h-3 text-gray-600" />
)

const Counter = ({ gender, maxNovice, maxMember, max, minAge, maxAge }) => {
  return (
    <div className="flex flex-col items-center">
      <Ages minAge={minAge} maxAge={maxAge} />
      {typeof maxNovice === 'number' || typeof maxMember === 'number' ? (
        <div className="flex items-center gap-x-0.5">
          <div className="flex flex-col">
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="novice" />
              <div className="flex tablet:gap-x-0.5">
                {maxNovice ?? <Infinity />}
              </div>
            </div>
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="member" />
              <div className="flex tablet:gap-x-0.5">
                {maxMember ?? <Infinity />}
              </div>
            </div>
          </div>
          <div className="flex gap-x-0.5 items-center">
            <div className="hidden min-w-[9px] h-[36px] tablet:block w-[9px]">
              <Image src="/img/other/bracet_left.png" width={9} height={36} />
            </div>
            <div className="min-w-[7px] h-[28px] tablet:hidden w-[8px]">
              <Image src="/img/other/bracet_left.png" width={7} height={28} />
            </div>
            <div className="flex flex-col items-center leading-[0.5rem] tablet:leading-3">
              <span className="text-xs">max</span>
              <span>{max ?? <Infinity />}</span>
              <span className="text-xs -mt-0.5">чел.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-x-0.5 items-center">
          {max ?? <Infinity className="h-5" />} чел.
        </div>
      )}
    </div>
  )
}

const LimitsAndAge = ({
  maxParticipants,
  maxMans,
  maxWomans,
  maxMansNovice,
  maxWomansNovice,
  maxMansMember,
  maxWomansMember,
  minMansAge,
  maxMansAge,
  minWomansAge,
  maxWomansAge,
}) => {
  const actualMaxMans =
    typeof maxMansNovice === 'number' && typeof maxMansMember === 'number'
      ? typeof maxMans === 'number'
        ? Math.min(maxMansNovice + maxMansMember, maxMans)
        : maxMansNovice + maxMansMember
      : typeof maxMans === 'number'
        ? maxMans
        : undefined

  const actualMaxWomans =
    typeof maxWomansNovice === 'number' && typeof maxWomansMember === 'number'
      ? typeof maxWomans === 'number'
        ? Math.min(maxWomansNovice + maxWomansMember, maxWomans)
        : maxWomansNovice + maxWomansMember
      : typeof maxWomans === 'number'
        ? maxWomans
        : undefined

  return (
    <div className="flex justify-between text-sm leading-4 border-gray-300 laptop:text-base laptop:leading-5 laptop:justify-start">
      <div className="flex items-center px-1 border-l border-r laptop:px-2 gap-x-1">
        <FontAwesomeIcon
          icon={faMars}
          className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="mans"
          maxNovice={maxMansNovice}
          maxMember={maxMansMember}
          minAge={minMansAge}
          maxAge={maxMansAge}
          max={actualMaxMans}
        />
      </div>
      <div className="flex items-center px-1 border-r laptop:px-2 gap-x-1">
        <FontAwesomeIcon
          icon={faVenus}
          className="w-5 h-5 text-red-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="womans"
          maxNovice={maxWomansNovice}
          maxMember={maxWomansMember}
          minAge={minWomansAge}
          maxAge={maxWomansAge}
          max={actualMaxWomans}
        />
      </div>
      <div className="flex items-center px-2 py-1 gap-x-1 laptop:gap-x-1">
        <div className="w-5 h-5 min-w-5">
          <SvgSigma className="fill-general" />
        </div>
        <div className="flex laptop:gap-x-0.5">
          <span>{maxParticipants ?? <Infinity />}</span>
        </div>
        <span className="hidden laptop:block">чел.</span>
      </div>
    </div>
  )
}

const eventFunc = (eventId, clone = false) => {
  const EventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const directions = useRecoilValue(directionsAtom)
    const setEvent = useRecoilValue(itemsFuncAtom).event.set
    // const [refPerticipantsMax, setFocusPerticipantsMax] = useFocus()
    // const [refMansMax, setFocusMansMax] = useFocus()
    // const [refWomansMax, setFocusWomansMax] = useFocus()
    // const [refMansNoviceMax, setFocusMansNoviceMax] = useFocus()
    // const [refWomansNoviceMax, setFocusWomansNoviceMax] = useFocus()
    // const [refMansMemberMax, setFocusMansMemberMax] = useFocus()
    // const [refWomansMemberMax, setFocusWomansMemberMax] = useFocus()
    const [directionId, setDirectionId] = useState(
      event?.directionId ?? DEFAULT_EVENT.directionId
    )

    const defaultOrganizerId =
      event?.organizerId ?? useRecoilValue(loggedUserAtom)._id
    const [organizerId, setOrganizerId] = useState(defaultOrganizerId)

    const [title, setTitle] = useState(event?.title ?? DEFAULT_EVENT.title)
    const [images, setImages] = useState(event?.images ?? DEFAULT_EVENT.images)
    const [description, setDescription] = useState(
      event?.description ?? DEFAULT_EVENT.description
    )

    const defaultTags = useMemo(
      () =>
        typeof event?.tags === 'object' ? event?.tags.filter((tag) => tag) : [],
      []
    )
    const [tags, setTags] = useState(defaultTags)

    const defaultDateStart = useMemo(
      () => event?.dateStart ?? Date.now() - (Date.now() % 3600000) + 3600000,
      []
    )

    const defaultDateEnd = useMemo(
      () => event?.dateEnd ?? defaultDateStart + 3600000,
      []
    )

    const [dateStart, setDateStart] = useState(defaultDateStart)
    const [dateEnd, setDateEnd] = useState(defaultDateEnd)

    // const [duration, setDuration] = useState(
    //   event?.duration ?? DEFAULT_EVENT.duration
    // )

    const [address, setAddress] = useState(
      event?.address && isObject(event.address)
        ? event.address
        : DEFAULT_EVENT.address
    )
    // const [price, setPrice] = useState(event?.price ?? DEFAULT_EVENT.price)
    const [subEvents, setSubEvents] = useState(
      event?.subEvents
        ? event.subEvents
        : eventId
          ? []
          : [
              {
                id: uid(24),
                title: 'Вариант участия №1',
                price: 0,
                usersStatusDiscount: { ...DEFAULT_USERS_STATUS_DISCOUNT },
                maxParticipants: null,
                maxMans: null,
                maxWomans: null,
                maxMansNovice: null,
                maxWomansNovice: null,
                maxMansMember: null,
                maxWomansMember: null,
                minMansAge: 35,
                minWomansAge: 30,
                maxMansAge: 50,
                maxWomansAge: 45,
                usersStatusAccess: {},
                usersRelationshipAccess: 'yes',
              },
            ]
    )

    // const [maxParticipants, setMaxParticipants] = useState(
    //   event?.maxParticipants ?? DEFAULT_EVENT.maxParticipants
    // )
    // const [maxMans, setMaxMans] = useState(
    //   event?.maxMans ?? DEFAULT_EVENT.maxMans
    // )
    // const [maxWomans, setMaxWomans] = useState(
    //   event?.maxWomans ?? DEFAULT_EVENT.maxWomans
    // )
    // const [maxParticipantsCheck, setMaxParticipantsCheck] = useState(
    //   typeof event?.maxParticipants !== 'number'
    // )
    // const [maxMansCheck, setMaxMansCheck] = useState(
    //   typeof event?.maxMans !== 'number'
    // )
    // const [maxWomansCheck, setMaxWomansCheck] = useState(
    //   typeof event?.maxWomans !== 'number'
    // )
    // const [maxMansNovice, setMaxMansNovice] = useState(
    //   event?.maxMansNovice ?? DEFAULT_EVENT.maxMansNovice
    // )
    // const [maxMansMember, setMaxMansMember] = useState(
    //   event?.maxMansMember ?? DEFAULT_EVENT.maxMansMember
    // )
    // const [maxWomansNovice, setMaxWomansNovice] = useState(
    //   event?.maxWomansNovice ?? DEFAULT_EVENT.maxWomansNovice
    // )
    // const [maxWomansMember, setMaxWomansMember] = useState(
    //   event?.maxWomansMember ?? DEFAULT_EVENT.maxWomansMember
    // )
    // const [maxMansNoviceCheck, setMaxMansNoviceCheck] = useState(
    //   typeof event?.maxMansNovice !== 'number'
    // )
    // const [maxMansMemberCheck, setMaxMansMemberCheck] = useState(
    //   typeof event?.maxMansMember !== 'number'
    // )
    // const [maxWomansNoviceCheck, setMaxWomansNoviceCheck] = useState(
    //   typeof event?.maxWomansNovice !== 'number'
    // )
    // const [maxWomansMemberCheck, setMaxWomansMemberCheck] = useState(
    //   typeof event?.maxWomansMember !== 'number'
    // )

    // const [minMansAge, setMinMansAge] = useState(
    //   event?.minMansAge ?? DEFAULT_EVENT.minMansAge
    // )
    // const [minWomansAge, setMinWomansAge] = useState(
    //   event?.minWomansAge ?? DEFAULT_EVENT.minWomansAge
    // )
    // const [maxMansAge, setMaxMansAge] = useState(
    //   event?.maxMansAge ?? DEFAULT_EVENT.maxMansAge
    // )
    // const [maxWomansAge, setMaxWomansAge] = useState(
    //   event?.maxWomansAge ?? DEFAULT_EVENT.maxWomansAge
    // )
    // const defaultUsersStatusAccess = {
    //   ...DEFAULT_USERS_STATUS_ACCESS,
    //   ...event?.usersStatusAccess,
    // }
    // const [usersStatusAccess, setUsersStatusAccess] = useState(
    //   defaultUsersStatusAccess
    // )

    // const defaultUsersStatusDiscount = {
    //   ...DEFAULT_USERS_STATUS_DISCOUNT,
    //   ...(event?.usersStatusDiscount ?? DEFAULT_EVENT.usersStatusDiscount),
    // }
    // const [usersStatusDiscount, setUsersStatusDiscount] = useState(
    //   defaultUsersStatusDiscount
    // )

    // const [usersRelationshipAccess, setUsersRelationshipAccess] = useState(
    //   event?.usersRelationshipAccess ?? DEFAULT_EVENT.usersRelationshipAccess
    // )

    const [showOnSite, setShowOnSite] = useState(
      event?.showOnSite ?? DEFAULT_EVENT.showOnSite
    )
    // const [isReserveActive, setIsReserveActive] = useState(
    //   event?.isReserveActive ?? DEFAULT_EVENT.isReserveActive
    // )
    const [reportImages, setReportImages] = useState(
      event?.reportImages ?? DEFAULT_EVENT.reportImages
    )
    const [report, setReport] = useState(event?.report ?? DEFAULT_EVENT.report)

    const [warning, setWarning] = useState(
      event?.warning ?? DEFAULT_EVENT.warning
    )

    const [likes, setLikes] = useState(event?.likes ?? DEFAULT_EVENT.likes)

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
      let isErrorsExists = checkErrors({
        title,
        description,
        images,
        directionId,
        organizerId,
        dateStart,
        dateEnd,
        tags,
      })
      if (getDiffBetweenDates(dateStart, dateEnd) < 0) {
        addError({
          dateEnd:
            'Дата завершения не может быть раньше даты начала мероприятия',
        })
        isErrorsExists = true
      }
      if (!isErrorsExists) {
        closeModal()
        setEvent(
          {
            _id: event?._id,
            images,
            title: title.trim(),
            description,
            tags,
            showOnSite,
            dateStart,
            dateEnd,
            // duration,
            address,
            // price,
            subEvents,
            directionId,
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
            report,
            reportImages,
            warning,
            likes,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        event?.title !== title ||
        event?.description !== description ||
        !compareArrays(defaultTags, tags) ||
        event?.showOnSite !== showOnSite ||
        dateStart !== defaultDateStart ||
        dateEnd !== defaultDateEnd ||
        // event?.duration !== duration ||
        !compareArrays(event?.images, images) ||
        !compareObjects(event?.address, address) ||
        // event?.price !== price ||
        !compareObjects(event?.subEvents, subEvents) ||
        event?.directionId !== directionId ||
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
        event?.report !== report ||
        !compareArrays(event?.reportImages, reportImages) ||
        event?.warning !== warning ||
        event?.likes !== likes

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
    ])

    const duration = getEventDuration({ dateStart, dateEnd })

    return (
      <>
        <TabContext value="Общие">
          <TabPanel tabName="Общие" className="px-0">
            {/* <FormWrapper> */}
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
            {/* <SelectDirection
              selectedId={directionId}
              onChange={(directionId) => {
                removeError('directionId')
                setDirectionId(directionId)
              }}
              required
              error={errors.directionId}
            /> */}
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
            {(direction?.rules?.userStatus &&
              direction?.rules?.userStatus !== 'select') ||
              (direction?.rules?.userRelationship &&
                direction?.rules?.userRelationship !== 'select' && (
                  <div className="pl-2 -mb-2 text-sm text-danger">
                    Применены ограничения доступа заданные направлением
                  </div>
                ))}
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
            <EditableTextarea
              label="Описание"
              html={description}
              uncontrolled={false}
              onChange={(value) => {
                removeError('description')
                setDescription(value)
              }}
              placeholder="Описание мероприятия..."
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
          </TabPanel>
          <TabPanel tabName="Варианты участия" className="px-0">
            <SubEvents subEvents={subEvents} onChange={setSubEvents} />
            {/* <PriceInput
              value={price}
              onChange={(value) => {
                removeError('price')
                setPrice(value)
              }}
              error={errors.price}
            />
            <CheckBox
              checked={usersStatusAccess?.noReg}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, noReg: !usersStatusAccess?.noReg }
                })
              }
              label="Не авторизован (видно на главной странице)"
            />
            <CheckBox
              checked={usersStatusAccess?.novice}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, novice: !usersStatusAccess?.novice }
                })
              }
              label="Новичок"
              disabled={['any', 'novice', 'member'].includes(
                direction?.rules?.userStatus
              )}
            />
            {usersStatusAccess?.novice && (
              <FormRow>
                <PriceInput
                  label="Скидка новичкам"
                  value={usersStatusDiscount?.novice ?? 0}
                  onChange={(value) => {
                    setUsersStatusDiscount((state) => {
                      return { ...state, novice: value }
                    })
                  }}
                  noMargin
                />
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0">
                  Итого: {(price - usersStatusDiscount?.novice) / 100} ₽
                </div>
              </FormRow>
            )}
            <CheckBox
              checked={usersStatusAccess?.member}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, member: !usersStatusAccess?.member }
                })
              }
              label="Участник клуба"
              disabled={['any', 'novice', 'member'].includes(
                direction?.rules?.userStatus
              )}
            />
            {usersStatusAccess?.member && (
              <FormRow>
                <PriceInput
                  label="Скидка участникам клуба"
                  value={usersStatusDiscount?.member ?? 0}
                  onChange={(value) => {
                    setUsersStatusDiscount((state) => {
                      return { ...state, member: value }
                    })
                  }}
                  noMargin
                />
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0">
                  Итого: {(price - usersStatusDiscount?.member) / 100} ₽
                </div>
              </FormRow>
            )}
            <EventRelationshipAccessPicker
              required
              relationshipStatus={usersRelationshipAccess}
              onChange={setUsersRelationshipAccess}
              disabled={['any', 'alone', 'pair'].includes(
                direction?.rules?.userRelationship
              )}
            />
            {(direction?.rules?.userStatus &&
              direction?.rules?.userStatus !== 'select') ||
              (direction?.rules?.userRelationship &&
                direction?.rules?.userRelationship !== 'select' && (
                  <div className="pl-2 -mb-2 text-sm text-danger">
                    Выбранное направление ограничевает доступ на изменение
                    некоторых прав
                  </div>
                ))} */}
          </TabPanel>
          {/* <TabPanel tabName="Ограничения" className="px-0">
            <CheckBox
              checked={isReserveActive}
              labelPos="left"
              onClick={() => setIsReserveActive((checked) => !checked)}
              label="Если мест нет, то возможно записаться в резерв"
            />
            <FormRow>
              <Input
                ref={refPerticipantsMax}
                label={
                  <div className="flex items-center gap-x-1">
                    <div className="w-3 h-3 min-w-3">
                      <SvgSigma className="fill-general" />
                    </div>
                    <span>max участников</span>
                  </div>
                }
                type={maxParticipantsCheck ? 'text' : 'number'}
                className="w-44"
                inputClassName="w-16 text-center"
                value={
                  maxParticipantsCheck
                    ? 'Без ограничений'
                    : maxParticipants ?? 0
                }
                onChange={setMaxParticipants}
                // error={errors?.address?.flat}
                placeholder={maxParticipantsCheck ? '' : '0'}
                disabled={maxParticipantsCheck}
                min={0}
                labelPos="left"
                onFocus={handleFocus}
                fullWidth={false}
                noMargin
              />
              <InfinityToggleButton
                size="s"
                value={maxParticipantsCheck}
                onChange={() => {
                  setMaxParticipantsCheck((checked) => !checked)
                }}
              />
            </FormRow>
            <FormRow className="flex-wrap laptop:flex-nowrap">
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faMars}
                    className="w-6 h-6 text-blue-600 tablet:w-6 tablet:h-6"
                  />
                }
                fullWidth
                paddingY
                paddingX={false}
                centerLabel
              >
                <div className="flex-1 px-1">
                  <FormRow>
                    <Input
                      ref={refMansMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <div className="w-3 h-3 min-w-3">
                            <SvgSigma className="fill-general" />
                          </div>
                          <span>max</span>
                        </div>
                      }
                      type={maxMansCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={maxMansCheck ? 'Без ограничений' : maxMans ?? 0}
                      onChange={setMaxMans}
                      placeholder={maxMansCheck ? '' : '0'}
                      disabled={maxMansCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansCheck}
                      onChange={() => {
                        setMaxMansCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refMansNoviceMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="novice" />
                          <span>max</span>
                        </div>
                      }
                      type={maxMansNoviceCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxMansNoviceCheck
                          ? 'Без ограничений'
                          : maxMansNovice ?? 0
                      }
                      onChange={setMaxMansNovice}
                      placeholder={maxMansNoviceCheck ? '' : '0'}
                      disabled={maxMansNoviceCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansNoviceCheck}
                      onChange={() => {
                        setMaxMansNoviceCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refMansMemberMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="member" />
                          <span>max</span>
                        </div>
                      }
                      type={maxMansMemberCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxMansMemberCheck
                          ? 'Без ограничений'
                          : maxMansMember ?? 0
                      }
                      onChange={setMaxMansMember}
                      placeholder={maxMansMemberCheck ? '' : '0'}
                      disabled={maxMansMemberCheck}
                      min={0}
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansMemberCheck}
                      onChange={() => {
                        setMaxMansMemberCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <Slider
                    value={[minMansAge, maxMansAge]}
                    onChange={([min, max]) => {
                      setMinMansAge(min)
                      setMaxMansAge(max)
                    }}
                    min={18}
                    max={60}
                    label="Возраст"
                    labelClassName="w-16 min-w-16"
                  />
                </div>
              </InputWrapper>
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faVenus}
                    className="w-6 h-6 text-red-600 tablet:w-6 tablet:h-6"
                  />
                }
                paddingX={false}
                paddingY
                centerLabel
                fullWidth
              >
                <div className="flex-1 px-1">
                  <FormRow>
                    <Input
                      ref={refWomansMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <div className="w-3 h-3 min-w-3">
                            <SvgSigma className="fill-general" />
                          </div>
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansCheck ? 'Без ограничений' : maxWomans ?? 0
                      }
                      onChange={setMaxWomans}
                      placeholder={maxWomansCheck ? '' : '0'}
                      disabled={maxWomansCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansCheck}
                      onChange={() => {
                        setMaxWomansCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refWomansNoviceMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="novice" />
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansNoviceCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansNoviceCheck
                          ? 'Без ограничений'
                          : maxWomansNovice ?? 0
                      }
                      onChange={setMaxWomansNovice}
                      placeholder={maxWomansNoviceCheck ? '' : '0'}
                      disabled={maxWomansNoviceCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansNoviceCheck}
                      onChange={() => {
                        setMaxWomansNoviceCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refWomansMemberMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="member" />
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansMemberCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansMemberCheck
                          ? 'Без ограничений'
                          : maxWomansMember ?? 0
                      }
                      onChange={setMaxWomansMember}
                      // error={errors?.address?.flat}
                      placeholder={maxWomansMemberCheck ? '' : '0'}
                      disabled={maxWomansMemberCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansMemberCheck}
                      onChange={() => {
                        setMaxWomansMemberCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <Slider
                    value={[minWomansAge, maxWomansAge]}
                    onChange={([min, max]) => {
                      setMinWomansAge(min)
                      setMaxWomansAge(max)
                    }}
                    min={18}
                    max={60}
                    label="Возраст"
                    labelClassName="w-16 min-w-16"
                  />
                </div>
              </InputWrapper>
            </FormRow>

          </TabPanel> */}
          {/* {eventId && (
            <TabPanel tabName="Отчет" className="px-0">
              <FormWrapper>
                <InputImages
                  label="Фотографии с мероприятия"
                  directory="reports"
                  images={reportImages}
                  onChange={(images) => {
                    removeError('reportImages')
                    setReportImages(images)
                  }}
                  // required
                  error={errors.reportImages}
                />
                <EditableTextarea
                  label="Отчет"
                  html={report}
                  uncontrolled={false}
                  onChange={(value) => {
                    removeError('report')
                    setReport(value)
                  }}
                  placeholder="Отчет о мероприятии..."
                  // required
                  error={errors.report}
                />
              </FormWrapper>
            </TabPanel>
          )} */}
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
