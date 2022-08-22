import React, { useEffect, useState } from 'react'
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
  DEFAULT_ADDRESS,
  DEFAULT_EVENT,
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import { SelectDirection, SelectUser } from '@components/SelectItem'
import EventStatusPicker from '@components/ValuePicker/EventStatusPicker'
import Slider from '@components/Slider'

// import Tab from '@mui/material/Tab'
// import TabContext from '@mui/lab/TabContext'
// import TabList from '@mui/lab/TabList'
// import TabPanel from '@mui/lab/TabPanel'
// import Tabs from '@mui/material/Tabs'
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react'
import TimePicker from '@components/TimePicker'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import compareArrays from '@helpers/compareArrays'
import compareObjects from '@helpers/compareObjects'

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

    const [directionId, setDirectionId] = useState(
      event?.directionId ?? DEFAULT_EVENT.directionId
    )
    const [organizerId, setOrganizerId] = useState(
      event?.organizerId ?? useRecoilValue(loggedUserAtom)._id
    )

    const [title, setTitle] = useState(event?.title ?? DEFAULT_EVENT.title)
    const [images, setImages] = useState(event?.images ?? DEFAULT_EVENT.images)
    const [description, setDescription] = useState(
      event?.description ?? DEFAULT_EVENT.description
    )
    const [date, setDate] = useState(
      event?.date ?? Date.now() - (Date.now() % 3600000) + 3600000
    )
    const [duration, setDuration] = useState(
      event?.duration ?? DEFAULT_EVENT.duration
    )
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

    const [usersStatusAccess, setUsersStatusAccess] = useState({
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...event?.usersStatusAccessusersStatusAccess,
    })

    const [usersStatusDiscount, setUsersStatusDiscount] = useState({
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(event?.usersStatusDiscount ?? DEFAULT_EVENT.usersStatusDiscount),
    })

    const [showOnSite, setShowOnSite] = useState(
      event?.showOnSite ?? DEFAULT_EVENT.showOnSite
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (
        !checkErrors({
          title,
          description,
          images,
          directionId,
          organizerId,
          date,
        })
      ) {
        closeModal()
        setEvent(
          {
            _id: event?._id,
            images,
            title,
            description,
            showOnSite,
            date,
            duration,
            address,
            price,
            directionId,
            maxParticipants: maxParticipantsCheck ? null : maxParticipants,
            maxMans: maxMansCheck ? null : maxMans,
            maxWomans: maxWomansCheck ? null : maxWomans,
            maxMansAge,
            minMansAge,
            maxWomansAge,
            minWomansAge,
            organizerId,
            status,
            usersStatusAccess,
            usersStatusDiscount,
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
        event?.date !== date ||
        event?.duration !== duration ||
        !compareArrays(event?.images, images) ||
        !compareObjects(event?.address, address) ||
        event?.price !== price ||
        event?.directionId !== directionId ||
        event?.maxParticipants !== maxParticipants ||
        event?.maxMans !== maxMans ||
        event?.maxWomans !== maxWomans ||
        event?.maxMansAge !== maxMansAge ||
        event?.maxWomansAge !== maxWomansAge ||
        event?.organizerId !== organizerId ||
        event?.status !== status ||
        !compareObjects(event?.usersStatusAccess, usersStatusAccess) ||
        !compareObjects(event?.usersStatusDiscount, usersStatusDiscount)

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [
      title,
      description,
      showOnSite,
      date,
      duration,
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
    ])

    // return (
    //   <>
    //     <Accordion open={page === 1} onClick={() => setPage(1)}>
    //       <AccordionHeader>Общие</AccordionHeader>
    //       <AccordionBody>
    //         {/* <FormWrapper>
    //           <InputImages
    //             label="Фотографии"
    //             directory="events"
    //             images={images}
    //             onChange={(images) => {
    //               removeError('images')
    //               setImages(images)
    //             }}
    //             required
    //             error={errors.images}
    //           />
    //           <SelectDirection
    //             selectedId={directionId}
    //             onChange={(direction) => {
    //               removeError('direction')
    //               setDirectionId(direction._id)
    //             }}
    //             required
    //             error={errors.direction}
    //           />
    //           <Input
    //             label="Название"
    //             type="text"
    //             value={title}
    //             onChange={(value) => {
    //               removeError('title')
    //               setTitle(value)
    //             }}
    //             // labelClassName="w-40"
    //             error={errors.title}
    //             required
    //           />
    //           <EditableTextarea
    //             label="Описание"
    //             html={description}
    //             uncontrolled={false}
    //             onChange={(value) => {
    //               removeError('description')
    //               setDescription(value)
    //             }}
    //             placeholder="Описание мероприятия..."
    //             required
    //             error={errors.description}
    //           />
    //           <DateTimePicker
    //             value={date}
    //             onChange={(date) => {
    //               removeError('date')
    //               setDate(date)
    //             }}
    //             label="Дата и время"
    //             required
    //             error={errors.date}
    //           />
    //           <SelectUser
    //             label="Организатор"
    //             selectedId={organizerId}
    //             onChange={(user) => setOrganizerId(user._id)}
    //             required
    //           />
    //           <AddressPicker address={address} onChange={setAddress} />
    //           <PriceInput
    //             value={price}
    //             onChange={(value) => {
    //               removeError('price')
    //               setPrice(value)
    //             }}
    //           />
    //         </FormWrapper> */}
    //         TEST
    //       </AccordionBody>
    //     </Accordion>
    //     <Accordion open={page === 2} onClick={() => setPage(2)}>
    //       <AccordionHeader>Доступ и стоимость</AccordionHeader>
    //       <AccordionBody>
    //         <FormWrapper>
    //           <FormWrapper flex>
    //             <Input
    //               label="Макс. участников"
    //               type="number"
    //               inputClassName="w-16"
    //               labelClassName="w-[20%]"
    //               value={maxParticipants}
    //               onChange={setMaxParticipants}
    //               // error={errors?.address?.flat}
    //               placeholder={maxParticipantsCheck ? '' : '0'}
    //               disabled={maxParticipantsCheck}
    //               min={0}
    //             />
    //             <CheckBox
    //               checked={maxParticipantsCheck}
    //               labelPos="right"
    //               onClick={() => setMaxParticipantsCheck((checked) => !checked)}
    //               label="Не ограничено"
    //             />
    //           </FormWrapper>

    //           <FormWrapper flex>
    //             <Input
    //               label="Макс. мужчин"
    //               type="number"
    //               inputClassName="w-16"
    //               labelClassName="w-[20%]"
    //               value={maxMans}
    //               onChange={setMaxMans}
    //               // error={errors?.address?.flat}
    //               placeholder={maxMansCheck ? '' : '0'}
    //               disabled={maxMansCheck}
    //               min={0}
    //             />
    //             <CheckBox
    //               checked={maxMansCheck}
    //               labelPos="right"
    //               onClick={() => setMaxMansCheck((checked) => !checked)}
    //               label="Не ограничено"
    //             />
    //           </FormWrapper>
    //           <FormWrapper flex>
    //             <Input
    //               label="Макс. женщин"
    //               type="number"
    //               inputClassName="w-16"
    //               labelClassName="w-[20%]"
    //               value={maxWomans}
    //               onChange={setMaxWomans}
    //               // error={errors?.address?.flat}
    //               placeholder={maxWomansCheck ? '' : '0'}
    //               disabled={maxWomansCheck}
    //               min={0}
    //             />
    //             <CheckBox
    //               checked={maxWomansCheck}
    //               labelPos="right"
    //               onClick={() => setMaxWomansCheck((checked) => !checked)}
    //               label="Не ограничено"
    //             />
    //           </FormWrapper>

    //           <FormWrapper flex>
    //             <Slider
    //               value={[minMansAge, maxMansAge]}
    //               onChange={([min, max]) => {
    //                 setMinMansAge(min)
    //                 setMaxMansAge(max)
    //               }}
    //               min={18}
    //               max={60}
    //               label="Возраст мужчин"
    //               labelClassName="w-[20%]"
    //               wrapperClassName="flex-1"
    //             />
    //           </FormWrapper>
    //           <FormWrapper flex>
    //             <Slider
    //               value={[minWomansAge, maxWomansAge]}
    //               onChange={([min, max]) => {
    //                 setMinWomansAge(min)
    //                 setMaxWomansAge(max)
    //               }}
    //               min={18}
    //               max={60}
    //               label="Возраст женщин"
    //               labelClassName="w-[20%]"
    //               wrapperClassName="flex-1"
    //             />
    //           </FormWrapper>
    //           <FormWrapper title="Доступ и скидки" flex>
    //             <CheckBox
    //               checked={usersStatusAccess?.noReg}
    //               labelPos="left"
    //               onClick={() =>
    //                 setUsersStatusAccess((state) => {
    //                   return { ...state, noReg: !usersStatusAccess?.noReg }
    //                 })
    //               }
    //               labelClassName="w-[20%]"
    //               label="Не авторизован"
    //             />
    //             {/* <PriceInput
    //       label="Скидка"
    //       value={price}
    //       onChange={(value) => {
    //         // removeError('price')
    //         setPrice(value)
    //       }} */}
    //             {/* /> */}
    //           </FormWrapper>
    //           <CheckBox
    //             checked={showOnSite}
    //             labelPos="left"
    //             // labelClassName="w-40"
    //             onClick={() => setShowOnSite((checked) => !checked)}
    //             label="Показывать на сайте"
    //           />

    //           {eventId && (
    //             <EventStatusPicker
    //               required
    //               status={status}
    //               onChange={setStatus}
    //             />
    //           )}
    //         </FormWrapper>
    //       </AccordionBody>
    //     </Accordion>
    //     <ErrorsList errors={errors} />
    //   </>
    // )

    return (
      // <TabContext value={tabPage}>
      <Tabs id="custom-animation" value="general">
        <TabsHeader
          // indicatorProps={{ className: 'duration-0 bg-general h-1 top-8' }}
          className="bg-gray-200 duration-0"
        >
          {/* {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))} */}
          <Tab key="general" value="general" className="italic font-bold">
            Общие
          </Tab>
          <Tab key="access" value="access" className="italic font-bold">
            Доступ и стоимость
          </Tab>
          {eventId && (
            <Tab key="status" value="status" className="italic font-bold">
              Статус и отчет
            </Tab>
          )}
        </TabsHeader>
        <TabsBody
          animate={{
            mount: { scale: 1 },
            unmount: { scale: 0 },
          }}
        >
          {/* <TabList
          onChange={(event, newValue) => setTabPage(newValue)}
          aria-label="lab API tabs example"
          variant="fullWidth"
        >
          <Tab label="Общие" value="1" />
          <Tab label="Доступ и стоимость" value="2" />
          <Tab label="Item Three" value="3" />
        </TabList> */}
          <TabPanel value="general">
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
                onChange={(direction) => {
                  removeError('directionId')
                  setDirectionId(direction._id)
                }}
                required
                error={errors.direction}
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
                  value={date}
                  onChange={(date) => {
                    removeError('date')
                    setDate(date)
                  }}
                  label="Дата и время"
                  required
                  error={errors.date}
                />
                <TimePicker
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
                />
              </FormWrapper>
              <SelectUser
                label="Организатор"
                selectedId={organizerId}
                onChange={(user) => {
                  removeError('organizerId')
                  setOrganizerId(user._id)
                }}
                required
                error={errors.organizer}
              />
              <AddressPicker address={address} onChange={setAddress} />
            </FormWrapper>
          </TabPanel>
          <TabPanel value="access">
            <FormWrapper title="Стоимость, доступ и скидки">
              <PriceInput
                value={price}
                onChange={(value) => {
                  removeError('price')
                  setPrice(value)
                }}
              />
              <FormWrapper flex>
                <CheckBox
                  checked={usersStatusAccess?.noReg}
                  labelPos="left"
                  onClick={() =>
                    setUsersStatusAccess((state) => {
                      return { ...state, noReg: !usersStatusAccess?.noReg }
                    })
                  }
                  labelClassName="w-[20%]"
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
              </FormWrapper>
              <FormWrapper flex className="min-h-[26px]">
                <CheckBox
                  checked={usersStatusAccess?.novice}
                  labelPos="left"
                  onClick={() =>
                    setUsersStatusAccess((state) => {
                      return { ...state, novice: !usersStatusAccess?.novice }
                    })
                  }
                  labelClassName="w-[20%]"
                  label="Новичок"
                />
                {usersStatusAccess?.novice && (
                  <div className="flex min-w-min flex-nowrap gap-x-1">
                    <PriceInput
                      label="Скидка"
                      value={usersStatusDiscount?.novice ?? 0}
                      onChange={(value) => {
                        // removeError('price')
                        setUsersStatusDiscount((state) => {
                          return { ...state, novice: value }
                        })
                      }}
                    />
                    <div>
                      Итого: {(price - usersStatusDiscount?.novice) / 100} ₽
                    </div>
                  </div>
                )}
              </FormWrapper>
              <FormWrapper flex className="min-h-[26px] flex-wrap">
                <CheckBox
                  checked={usersStatusAccess?.member}
                  labelPos="left"
                  onClick={() =>
                    setUsersStatusAccess((state) => {
                      return { ...state, member: !usersStatusAccess?.member }
                    })
                  }
                  labelClassName="w-[20%]"
                  label="Участник клуба"
                />
                {usersStatusAccess?.member && (
                  <div className="flex min-w-min flex-nowrap gap-x-1">
                    <PriceInput
                      label="Скидка"
                      value={usersStatusDiscount?.member ?? 0}
                      onChange={(value) => {
                        // removeError('price')
                        setUsersStatusDiscount((state) => {
                          return { ...state, member: value }
                        })
                      }}
                    />
                    <div>
                      Итого: {(price - usersStatusDiscount?.member) / 100} ₽
                    </div>
                  </div>
                )}
              </FormWrapper>
              <FormWrapper title="Ограничения" flex>
                <Input
                  label="Макс. участников"
                  type="number"
                  inputClassName="w-16"
                  labelClassName="w-[20%]"
                  value={maxParticipants}
                  onChange={setMaxParticipants}
                  // error={errors?.address?.flat}
                  placeholder={maxParticipantsCheck ? '' : '0'}
                  disabled={maxParticipantsCheck}
                  min={0}
                />
                <CheckBox
                  checked={maxParticipantsCheck}
                  labelPos="right"
                  onClick={() => setMaxParticipantsCheck((checked) => !checked)}
                  label="Не ограничено"
                />
              </FormWrapper>

              <FormWrapper flex>
                <Input
                  label="Макс. мужчин"
                  type="number"
                  inputClassName="w-16"
                  labelClassName="w-[20%]"
                  value={maxMans}
                  onChange={setMaxMans}
                  // error={errors?.address?.flat}
                  placeholder={maxMansCheck ? '' : '0'}
                  disabled={maxMansCheck}
                  min={0}
                />
                <CheckBox
                  checked={maxMansCheck}
                  labelPos="right"
                  onClick={() => setMaxMansCheck((checked) => !checked)}
                  label="Не ограничено"
                />
              </FormWrapper>
              <FormWrapper flex>
                <Input
                  label="Макс. женщин"
                  type="number"
                  inputClassName="w-16"
                  labelClassName="w-[20%]"
                  value={maxWomans}
                  onChange={setMaxWomans}
                  // error={errors?.address?.flat}
                  placeholder={maxWomansCheck ? '' : '0'}
                  disabled={maxWomansCheck}
                  min={0}
                />
                <CheckBox
                  checked={maxWomansCheck}
                  labelPos="right"
                  onClick={() => setMaxWomansCheck((checked) => !checked)}
                  label="Не ограничено"
                />
              </FormWrapper>

              <FormWrapper flex>
                <Slider
                  value={[minMansAge, maxMansAge]}
                  onChange={([min, max]) => {
                    setMinMansAge(min)
                    setMaxMansAge(max)
                  }}
                  min={18}
                  max={60}
                  label="Возраст мужчин"
                  labelClassName="w-[20%]"
                  wrapperClassName="flex-1"
                />
              </FormWrapper>
              <FormWrapper flex>
                <Slider
                  value={[minWomansAge, maxWomansAge]}
                  onChange={([min, max]) => {
                    setMinWomansAge(min)
                    setMaxWomansAge(max)
                  }}
                  min={18}
                  max={60}
                  label="Возраст женщин"
                  labelClassName="w-[20%]"
                  wrapperClassName="flex-1"
                />
              </FormWrapper>

              <FormWrapper title="Видимость">
                <CheckBox
                  checked={showOnSite}
                  labelPos="left"
                  // labelClassName="w-40"
                  onClick={() => setShowOnSite((checked) => !checked)}
                  label="Показывать на сайте"
                />
              </FormWrapper>
            </FormWrapper>
          </TabPanel>
          {eventId && (
            <TabPanel value="status">
              <FormWrapper>
                <EventStatusPicker
                  required
                  status={status}
                  onChange={setStatus}
                />
              </FormWrapper>
            </TabPanel>
          )}
        </TabsBody>

        <ErrorsList errors={errors} />
      </Tabs>
    )
  }

  return {
    title: `${eventId && !clone ? 'Редактирование' : 'Создание'} мероприятия`,
    confirmButtonName: eventId && !clone ? 'Применить' : 'Создать',
    Children: EventModal,
  }
}

export default eventFunc
