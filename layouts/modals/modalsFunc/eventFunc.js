import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import DateTimePicker from '@components/DateTimePicker'
import ErrorsList from '@components/ErrorsList'
import AddressPicker from '@components/AddressPicker'
import InputImages from '@components/InputImages'
import PriceInput from '@components/PriceInput'
import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import formatMinutes from '@helpers/formatMinutes'

import {
  DEFAULT_EVENT,
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import { SelectDirection, SelectUser } from '@components/SelectItem'
import EventStatusPicker from '@components/ValuePicker/EventStatusPicker'
import Slider from '@components/Slider'

import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import FormRow from '@components/FormRow'
import useFocus from '@helpers/useFocus'
import getEventDuration from '@helpers/getEventDuration'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import UserStatusIcon from '@components/UserStatusIcon'
import InfinityToggleButton from '@components/IconToggleButtons/InfinityToggleButton'
import SvgSigma from 'svg/SvgSigma'
import InputWrapper from '@components/InputWrapper'
import isObject from '@helpers/isObject'

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
    const setEvent = useRecoilValue(itemsFuncAtom).event.set
    const [refPerticipantsMax, setFocusPerticipantsMax] = useFocus()
    const [refMansMax, setFocusMansMax] = useFocus()
    const [refWomansMax, setFocusWomansMax] = useFocus()
    const [refMansNoviceMax, setFocusMansNoviceMax] = useFocus()
    const [refWomansNoviceMax, setFocusWomansNoviceMax] = useFocus()
    const [refMansMemberMax, setFocusMansMemberMax] = useFocus()
    const [refWomansMemberMax, setFocusWomansMemberMax] = useFocus()
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
    const [price, setPrice] = useState(event?.price ?? DEFAULT_EVENT.proce)

    // const [status, setStatus] = useState(event?.status ?? DEFAULT_EVENT.status)

    const [maxParticipants, setMaxParticipants] = useState(
      event?.maxParticipants ?? DEFAULT_EVENT.maxParticipants
    )
    const [maxMans, setMaxMans] = useState(
      event?.maxMans ?? DEFAULT_EVENT.maxMans
    )
    const [maxWomans, setMaxWomans] = useState(
      event?.maxWomans ?? DEFAULT_EVENT.maxWomans
    )
    const [maxParticipantsCheck, setMaxParticipantsCheck] = useState(
      typeof event?.maxParticipants !== 'number'
    )
    const [maxMansCheck, setMaxMansCheck] = useState(
      typeof event?.maxMans !== 'number'
    )
    const [maxWomansCheck, setMaxWomansCheck] = useState(
      typeof event?.maxWomans !== 'number'
    )
    const [maxMansNovice, setMaxMansNovice] = useState(
      event?.maxMansNovice ?? DEFAULT_EVENT.maxMansNovice
    )
    const [maxMansMember, setMaxMansMember] = useState(
      event?.maxMansMember ?? DEFAULT_EVENT.maxMansMember
    )
    const [maxWomansNovice, setMaxWomansNovice] = useState(
      event?.maxWomansNovice ?? DEFAULT_EVENT.maxWomansNovice
    )
    const [maxWomansMember, setMaxWomansMember] = useState(
      event?.maxWomansMember ?? DEFAULT_EVENT.maxWomansMember
    )
    const [maxMansNoviceCheck, setMaxMansNoviceCheck] = useState(
      typeof event?.maxMansNovice !== 'number'
    )
    const [maxMansMemberCheck, setMaxMansMemberCheck] = useState(
      typeof event?.maxMansMember !== 'number'
    )
    const [maxWomansNoviceCheck, setMaxWomansNoviceCheck] = useState(
      typeof event?.maxWomansNovice !== 'number'
    )
    const [maxWomansMemberCheck, setMaxWomansMemberCheck] = useState(
      typeof event?.maxWomansMember !== 'number'
    )

    const [minMansAge, setMinMansAge] = useState(
      event?.minMansAge ?? DEFAULT_EVENT.minMansAge
    )
    const [minWomansAge, setMinWomansAge] = useState(
      event?.minWomansAge ?? DEFAULT_EVENT.minWomansAge
    )
    const [maxMansAge, setMaxMansAge] = useState(
      event?.maxMansAge ?? DEFAULT_EVENT.maxMansAge
    )
    const [maxWomansAge, setMaxWomansAge] = useState(
      event?.maxWomansAge ?? DEFAULT_EVENT.maxWomansAge
    )
    const defaultUsersStatusAccess = {
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...event?.usersStatusAccess,
    }
    const [usersStatusAccess, setUsersStatusAccess] = useState(
      defaultUsersStatusAccess
    )

    const defaultUsersStatusDiscount = {
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(event?.usersStatusDiscount ?? DEFAULT_EVENT.usersStatusDiscount),
    }
    const [usersStatusDiscount, setUsersStatusDiscount] = useState(
      defaultUsersStatusDiscount
    )

    const [showOnSite, setShowOnSite] = useState(
      event?.showOnSite ?? DEFAULT_EVENT.showOnSite
    )
    const [isReserveActive, setIsReserveActive] = useState(
      event?.isReserveActive ?? DEFAULT_EVENT.isReserveActive
    )
    const [reportImages, setReportImages] = useState(
      event?.reportImages ?? DEFAULT_EVENT.reportImages
    )
    const [report, setReport] = useState(event?.report ?? DEFAULT_EVENT.report)

    const [warning, setWarning] = useState(
      event?.warning ?? DEFAULT_EVENT.warning
    )

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
            showOnSite,
            dateStart,
            dateEnd,
            // duration,
            address,
            price,
            directionId,
            maxParticipants: maxParticipantsCheck ? null : maxParticipants ?? 0,
            maxMans: maxMansCheck ? null : maxMans ?? 0,
            maxWomans: maxWomansCheck ? null : maxWomans ?? 0,
            maxMansNovice: maxMansNoviceCheck ? null : maxMansNovice ?? 0,
            maxWomansNovice: maxWomansNoviceCheck ? null : maxWomansNovice ?? 0,
            maxMansMember: maxMansMemberCheck ? null : maxMansMember ?? 0,
            maxWomansMember: maxWomansMemberCheck ? null : maxWomansMember ?? 0,
            maxMansAge,
            minMansAge,
            maxWomansAge,
            minWomansAge,
            organizerId,
            // status,
            usersStatusAccess,
            usersStatusDiscount,
            isReserveActive,
            report,
            reportImages,
            warning,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        event?.title !== title ||
        event?.description !== description ||
        event?.showOnSite !== showOnSite ||
        dateStart !== defaultDateStart ||
        dateEnd !== defaultDateEnd ||
        // event?.duration !== duration ||
        !compareArrays(event?.images, images) ||
        !compareObjects(event?.address, address) ||
        event?.price !== price ||
        event?.directionId !== directionId ||
        event?.maxParticipants !==
          (maxParticipantsCheck ? null : maxParticipants ?? 0) ||
        event?.maxMans !== (maxMansCheck ? null : maxMans ?? 0) ||
        event?.maxWomans !== (maxWomansCheck ? null : maxWomans ?? 0) ||
        event?.maxMansNovice !==
          (maxMansNoviceCheck ? null : maxMansNovice ?? 0) ||
        event?.maxWomansNovice !==
          (maxWomansNoviceCheck ? null : maxWomansNovice ?? 0) ||
        event?.maxMansMember !==
          (maxMansMemberCheck ? null : maxMansMember ?? 0) ||
        event?.maxWomansMember !==
          (maxWomansMemberCheck ? null : maxWomansMember ?? 0) ||
        event?.minMansAge !== minMansAge ||
        event?.maxMansAge !== maxMansAge ||
        event?.minWomansAge !== minWomansAge ||
        event?.maxWomansAge !== maxWomansAge ||
        organizerId !== defaultOrganizerId ||
        // event?.status !== status ||
        !compareObjects(defaultUsersStatusAccess, usersStatusAccess) ||
        !compareObjects(defaultUsersStatusDiscount, usersStatusDiscount) ||
        event?.isReserveActive !== isReserveActive ||
        event?.report !== report ||
        !compareArrays(event?.reportImages, reportImages) ||
        event?.warning !== warning

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [
      title,
      description,
      showOnSite,
      dateStart,
      dateEnd,
      // duration,
      images,
      address,
      price,
      directionId,
      maxParticipants,
      maxMans,
      maxWomans,
      maxMansNovice,
      maxWomansNovice,
      maxMansMember,
      maxWomansMember,
      maxMansAge,
      minMansAge,
      maxWomansAge,
      minWomansAge,
      organizerId,
      maxParticipantsCheck,
      maxMansCheck,
      maxWomansCheck,
      maxMansNoviceCheck,
      maxWomansNoviceCheck,
      maxMansMemberCheck,
      maxWomansMemberCheck,
      // status,
      usersStatusAccess,
      usersStatusDiscount,
      isReserveActive,
      report,
      reportImages,
      warning,
    ])

    const handleFocus = (event) => event.target.select()

    useEffect(() => {
      if (!maxParticipantsCheck) setFocusPerticipantsMax()
    }, [maxParticipantsCheck])
    useEffect(() => {
      if (!maxMansCheck) setFocusMansMax()
    }, [maxMansCheck])
    useEffect(() => {
      if (!maxWomansCheck) setFocusWomansMax()
    }, [maxWomansCheck])
    useEffect(() => {
      if (!maxMansNoviceCheck) setFocusMansNoviceMax()
    }, [maxMansNoviceCheck])
    useEffect(() => {
      if (!maxWomansNoviceCheck) setFocusWomansNoviceMax()
    }, [maxWomansNoviceCheck])
    useEffect(() => {
      if (!maxMansMemberCheck) setFocusMansMemberMax()
    }, [maxMansMemberCheck])
    useEffect(() => {
      if (!maxWomansMemberCheck) setFocusWomansMemberMax()
    }, [maxWomansMemberCheck])

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
            <SelectDirection
              selectedId={directionId}
              onChange={(directionId) => {
                removeError('directionId')
                setDirectionId(directionId)
              }}
              required
              error={errors.directionId}
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
            {/* <FormWrapper twoColumns> */}
            <FormRow>
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
                <div className="flex items-center pt-[18px] leading-3 laptop:pt-0 text-danger">
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
              <div className="flex items-center pt-[18px] leading-3 laptop:pt-0">
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
            <CheckBox
              checked={warning}
              labelPos="left"
              // labelClassName="w-40"
              onClick={() => setWarning((checked) => !checked)}
              label="Предупреждение о рисках и травмоопасности на мероприятии"
            />

            {/* <FormWrapper title="Видимость"> */}
            <CheckBox
              checked={showOnSite}
              labelPos="left"
              // labelClassName="w-40"
              onClick={() => setShowOnSite((checked) => !checked)}
              label="Показывать на сайте"
            />
            {/* </FormWrapper> */}
          </TabPanel>
          <TabPanel tabName="Доступ и стоимость" className="px-0">
            {/* <FormWrapper title="Стоимость, доступ и скидки"> */}
            {/* <FormRow> */}
            <PriceInput
              value={price}
              onChange={(value) => {
                removeError('price')
                setPrice(value)
              }}
              error={errors.price}
              // labelPos="left"
              // fullWidth={false}
            />
            {/* </FormRow> */}
            {/* <FormWrapper> */}
            <CheckBox
              checked={usersStatusAccess?.noReg}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, noReg: !usersStatusAccess?.noReg }
                })
              }
              // labelClassName="w-[20%]"
              label="Не авторизован"
            />
            {/* <PriceInput
          label="Скидка"
          value={price}
          onChange={(value) => {
            // removeError('price')
            setPrice(value)
          }} */}
            {/* /> */}
            {/* </FormWrapper> */}
            {/* <FormWrapper className="min-h-[26px]"> */}
            {/* <FormRow className="tablet:min-h-[26px]"> */}
            <CheckBox
              checked={usersStatusAccess?.novice}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, novice: !usersStatusAccess?.novice }
                })
              }
              // labelClassName="w-[20%]"
              label="Новичок"
            />
            {usersStatusAccess?.novice && (
              <FormRow>
                <PriceInput
                  label="Скидка новичкам"
                  value={usersStatusDiscount?.novice ?? 0}
                  onChange={(value) => {
                    // removeError('price')
                    setUsersStatusDiscount((state) => {
                      return { ...state, novice: value }
                    })
                  }}
                  noMargin
                  // labelContentWidth
                  // labelPos="left"
                />
                <div>
                  Итого: {(price - usersStatusDiscount?.novice) / 100} ₽
                </div>
              </FormRow>
            )}
            {/* </FormRow> */}
            {/* </FormWrapper> */}
            {/* <FormWrapper className="min-h-[26px] flex-wrap"> */}
            {/* <FormRow className="tablet:min-h-[26px]"> */}
            <CheckBox
              checked={usersStatusAccess?.member}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, member: !usersStatusAccess?.member }
                })
              }
              // labelClassName="w-[20%]"
              label="Участник клуба"
            />
            {usersStatusAccess?.member && (
              <FormRow>
                <PriceInput
                  label="Скидка участникам клуба"
                  value={usersStatusDiscount?.member ?? 0}
                  onChange={(value) => {
                    // removeError('price')
                    setUsersStatusDiscount((state) => {
                      return { ...state, member: value }
                    })
                  }}
                  noMargin
                  // labelContentWidth
                  // labelPos="left"
                />
                <div>
                  Итого: {(price - usersStatusDiscount?.member) / 100} ₽
                </div>
              </FormRow>
            )}
            {/* </FormRow> */}
            {/* </FormWrapper> */}
          </TabPanel>
          <TabPanel tabName="Ограничения" className="px-0">
            {/* <FormWrapper> */}
            <CheckBox
              checked={isReserveActive}
              labelPos="left"
              // labelClassName="w-40"
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
                inputClassName="w-16"
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
              {/* <CheckBox
                  checked={maxParticipantsCheck}
                  labelPos="right"
                  onClick={() => {
                    setMaxParticipantsCheck((checked) => !checked)
                  }}
                  label="Не ограничено"
                /> */}
            </FormRow>
            {/* </FormWrapper> */}
            <FormRow className="flex-wrap laptop:flex-nowrap">
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faMars}
                    className="w-6 h-6 text-blue-600 tablet:w-6 tablet:h-6"
                  />
                }
                // labelClassName={labelClassName}
                // onChange={onChange}
                // copyPasteButtons={false}
                // value={address}
                // className={wrapperClassName}
                // required={required}
                paddingY
                paddingX={false}
                centerLabel
              >
                {/* <div className="flex border-t border-gray-300">
                <div className="flex items-center pr-1 border-r border-gray-300">
                  <FontAwesomeIcon
                    icon={faMars}
                    className="w-6 h-6 text-blue-600 tablet:w-6 tablet:h-6"
                  />
                </div> */}
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
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16 justify-end"
                      value={maxMansCheck ? 'Без ограничений' : maxMans ?? 0}
                      onChange={setMaxMans}
                      // error={errors?.address?.flat}
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
                    {/* <div className="flex justify-end w-16">
                      <UserStatusIcon size="m" status="novice" />
                    </div> */}
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
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16"
                      value={
                        maxMansNoviceCheck
                          ? 'Без ограничений'
                          : maxMansNovice ?? 0
                      }
                      onChange={setMaxMansNovice}
                      // error={errors?.address?.flat}
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
                    {/* <div className="flex justify-end w-16">
                      <UserStatusIcon size="m" status="member" />
                    </div> */}
                    <Input
                      ref={refMansMemberMax}
                      // label="MAX"
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="member" />
                          <span>max</span>
                        </div>
                      }
                      type={maxMansMemberCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16"
                      value={
                        maxMansMemberCheck
                          ? 'Без ограничений'
                          : maxMansMember ?? 0
                      }
                      onChange={setMaxMansMember}
                      // error={errors?.address?.flat}
                      placeholder={maxMansMemberCheck ? '' : '0'}
                      disabled={maxMansMemberCheck}
                      min={0}
                      // labelPos="left"
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
                {/* </div> */}
              </InputWrapper>
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faVenus}
                    className="w-6 h-6 text-red-600 tablet:w-6 tablet:h-6"
                  />
                }
                // labelClassName={labelClassName}
                // onChange={onChange}
                // copyPasteButtons={false}
                // value={address}
                // className={wrapperClassName}
                // required={required}
                paddingX={false}
                paddingY
                centerLabel
              >
                {/* <div className="flex border-t border-b border-gray-300">
                <div className="flex items-center pr-1 border-r border-gray-300">
                  <FontAwesomeIcon
                    icon={faVenus}
                    className="w-6 h-6 text-red-600 tablet:w-6 tablet:h-6"
                  />
                </div> */}
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
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16 justify-end"
                      value={
                        maxWomansCheck ? 'Без ограничений' : maxWomans ?? 0
                      }
                      onChange={setMaxWomans}
                      // error={errors?.address?.flat}
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
                    {/* <div className="flex justify-end w-16">
                      <UserStatusIcon size="m" status="novice" />
                    </div> */}
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
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16"
                      value={
                        maxWomansNoviceCheck
                          ? 'Без ограничений'
                          : maxWomansNovice ?? 0
                      }
                      onChange={setMaxWomansNovice}
                      // error={errors?.address?.flat}
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
                    {/* <div className="flex justify-end w-16">
                      <UserStatusIcon size="m" status="member" />
                    </div> */}
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
                      inputClassName="w-16"
                      // labelClassName="w-16 min-w-16"
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
                    // labelClassName="w-[20%]"
                    // wrapperClassName="flex-1"
                  />
                </div>
                {/* </div> */}
              </InputWrapper>
            </FormRow>

            {/* </FormWrapper> */}
            {/* </FormWrapper> */}
          </TabPanel>
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
