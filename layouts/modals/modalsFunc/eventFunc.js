import React, { useEffect, useLayoutEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

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

// import TimePicker from '@components/TimePicker'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import FormRow from '@components/FormRow'
import useFocus from '@helpers/useFocus'
import getEventDuration from '@helpers/getEventDuration'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'

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

    const defaultDateStart =
      event?.dateStart ?? Date.now() - (Date.now() % 3600000) + 3600000
    const defaultDateEnd = event?.dateEnd ?? defaultDateStart + 3600000

    const [dateStart, setDateStart] = useState(defaultDateStart)
    const [dateEnd, setDateEnd] = useState(defaultDateEnd)

    // const [duration, setDuration] = useState(
    //   event?.duration ?? DEFAULT_EVENT.duration
    // )

    const [address, setAddress] = useState(
      event?.address && typeof event.address === 'object'
        ? event.address
        : DEFAULT_EVENT.address
    )
    const [price, setPrice] = useState(event?.price ?? DEFAULT_EVENT.proce)

    const [status, setStatus] = useState(event?.status ?? DEFAULT_EVENT.status)

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
            title,
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
            maxMansAge,
            minMansAge,
            maxWomansAge,
            minWomansAge,
            organizerId,
            status,
            usersStatusAccess,
            usersStatusDiscount,
            isReserveActive,
            report,
            reportImages,
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
        event?.minMansAge !== minMansAge ||
        event?.maxMansAge !== maxMansAge ||
        event?.minWomansAge !== minWomansAge ||
        event?.maxWomansAge !== maxWomansAge ||
        organizerId !== defaultOrganizerId ||
        event?.status !== status ||
        !compareObjects(defaultUsersStatusAccess, usersStatusAccess) ||
        !compareObjects(defaultUsersStatusDiscount, usersStatusDiscount) ||
        event?.isReserveActive !== isReserveActive ||
        event?.report !== report ||
        !compareArrays(event?.reportImages, reportImages)

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
      maxMansAge,
      minMansAge,
      maxWomansAge,
      minWomansAge,
      organizerId,
      maxParticipantsCheck,
      maxMansCheck,
      maxWomansCheck,
      status,
      usersStatusAccess,
      usersStatusDiscount,
      isReserveActive,
      report,
      reportImages,
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

    const duration = getEventDuration({ dateStart, dateEnd })

    return (
      <>
        <TabContext value="Общие">
          <TabPanel tabName="Общие" className="px-0">
            <FormWrapper>
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
              <FormWrapper twoColumns>
                <DateTimePicker
                  value={dateStart}
                  onChange={(date) => {
                    removeError('dateStart')
                    setDateStart(date)
                  }}
                  label="Начало"
                  required
                  error={errors.dateStart}
                />
                <div className="flex items-stretch gap-x-1">
                  <DateTimePicker
                    value={dateEnd}
                    onChange={(date) => {
                      removeError('dateEnd')
                      setDateEnd(date)
                    }}
                    label="Завершение"
                    required
                    error={errors.dateEnd}
                  />
                  <div className="flex items-end py-0.5 laptop:py-1">
                    {formatMinutes(duration)}
                  </div>
                </div>
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
              </FormWrapper>
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
            </FormWrapper>
          </TabPanel>
          <TabPanel tabName="Доступ и стоимость" className="px-0">
            <FormWrapper title="Стоимость, доступ и скидки">
              <PriceInput
                value={price}
                onChange={(value) => {
                  removeError('price')
                  setPrice(value)
                }}
                error={errors.price}
                // labelPos="left"
              />
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
              <FormWrapper title="Ограничения">
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
                    label="Макс. участников"
                    type="number"
                    inputClassName="w-16"
                    value={maxParticipantsCheck ? null : maxParticipants ?? 0}
                    onChange={setMaxParticipants}
                    // error={errors?.address?.flat}
                    placeholder={maxParticipantsCheck ? '' : '0'}
                    disabled={maxParticipantsCheck}
                    min={0}
                    labelPos="left"
                    onFocus={handleFocus}
                  />
                  <CheckBox
                    checked={maxParticipantsCheck}
                    labelPos="right"
                    onClick={() => {
                      setMaxParticipantsCheck((checked) => !checked)
                    }}
                    label="Не ограничено"
                  />
                </FormRow>
              </FormWrapper>

              <FormWrapper>
                <FormRow>
                  <Input
                    ref={refMansMax}
                    label="Макс. мужчин"
                    type="number"
                    inputClassName="w-16"
                    value={maxMansCheck ? null : maxMans ?? 0}
                    onChange={setMaxMans}
                    // error={errors?.address?.flat}
                    placeholder={maxMansCheck ? '' : '0'}
                    disabled={maxMansCheck}
                    min={0}
                    labelPos="left"
                    onFocus={handleFocus}
                  />
                  <CheckBox
                    checked={maxMansCheck}
                    labelPos="right"
                    onClick={() => setMaxMansCheck((checked) => !checked)}
                    label="Не ограничено"
                  />
                </FormRow>
                {/* </FormWrapper>
              <FormWrapper> */}
                <FormRow>
                  <Input
                    ref={refWomansMax}
                    label="Макс. женщин"
                    type="number"
                    inputClassName="w-16"
                    value={maxWomansCheck ? null : maxWomans ?? 0}
                    onChange={setMaxWomans}
                    // error={errors?.address?.flat}
                    placeholder={maxWomansCheck ? '' : '0'}
                    disabled={maxWomansCheck}
                    min={0}
                    labelPos="left"
                    onFocus={handleFocus}
                  />
                  <CheckBox
                    checked={maxWomansCheck}
                    labelPos="right"
                    onClick={() => setMaxWomansCheck((checked) => !checked)}
                    label="Не ограничено"
                  />
                </FormRow>
                {/* </FormWrapper>

              <FormWrapper> */}
                <Slider
                  value={[minMansAge, maxMansAge]}
                  onChange={([min, max]) => {
                    setMinMansAge(min)
                    setMaxMansAge(max)
                  }}
                  min={18}
                  max={60}
                  label="Возраст мужчин"
                  // labelClassName="w-[20%]"
                  // wrapperClassName="flex-1"
                />
                {/* </FormWrapper> */}
                {/* <FormWrapper> */}
                <Slider
                  value={[minWomansAge, maxWomansAge]}
                  onChange={([min, max]) => {
                    setMinWomansAge(min)
                    setMaxWomansAge(max)
                  }}
                  min={18}
                  max={60}
                  label="Возраст женщин"
                  // labelClassName="w-[20%]"
                  // wrapperClassName="flex-1"
                />
              </FormWrapper>

              {/* <FormWrapper title="Видимость"> */}
              <CheckBox
                checked={showOnSite}
                labelPos="left"
                // labelClassName="w-40"
                onClick={() => setShowOnSite((checked) => !checked)}
                label="Показывать на сайте"
              />
              {/* </FormWrapper> */}
            </FormWrapper>
          </TabPanel>
          {eventId && (
            <TabPanel tabName="Статус и отчет" className="px-0">
              <FormWrapper>
                <EventStatusPicker
                  required
                  status={status}
                  onChange={setStatus}
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
              </FormWrapper>
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
