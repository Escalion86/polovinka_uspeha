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

import {
  DEFAULT_ADDRESS,
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

const eventFunc = (eventId, clone = false) => {
  const EventModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const setEvent = useRecoilValue(itemsFuncAtom).event.set

    const [page, setPage] = useState(1)

    const [directionId, setDirectionId] = useState(event?.directionId ?? null)
    const [organizerId, setOrganizerId] = useState(event?.organizerId ?? null)
    const [title, setTitle] = useState(event?.title ?? '')
    const [images, setImages] = useState(event?.images ?? [])
    const [description, setDescription] = useState(event?.description ?? '')
    const [date, setDate] = useState(event?.date ?? Date.now())
    const [address, setAddress] = useState(
      event?.address && typeof event.address === 'object'
        ? event.address
        : DEFAULT_ADDRESS
    )
    const [price, setPrice] = useState(event?.price ?? 0)

    const [status, setStatus] = useState(event?.status ?? 'active')

    const [maxParticipants, setMaxParticipants] = useState(
      event?.maxParticipants ?? null
    )
    const [maxMans, setMaxMans] = useState(event?.maxMans ?? null)
    const [maxWomans, setMaxWomans] = useState(event?.maxWomans ?? null)
    const [maxParticipantsCheck, setMaxParticipantsCheck] = useState(
      typeof event.maxParticipants !== 'number'
    )
    const [maxMansCheck, setMaxMansCheck] = useState(
      typeof event.maxMans !== 'number'
    )
    const [maxWomansCheck, setMaxWomansCheck] = useState(
      typeof event.maxWomans !== 'number'
    )

    const [minMansAge, setMinMansAge] = useState(event?.minMansAge ?? 18)
    const [minWomansAge, setMinWomansAge] = useState(event?.minWomansAge ?? 18)
    const [maxMansAge, setMaxMansAge] = useState(event?.maxMansAge ?? 60)
    const [maxWomansAge, setMaxWomansAge] = useState(event?.maxWomansAge ?? 60)

    const [usersStatusAccess, setUsersStatusAccess] = useState({
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...(event?.usersStatusAccess ?? {}),
    })

    const [usersStatusDiscount, setUsersStatusDiscount] = useState({
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(event?.usersStatusDiscount ?? {}),
    })

    const [showOnSite, setShowOnSite] = useState(event?.showOnSite ?? true)
    const [errors, addError, removeError, clearErrors] = useErrors()

    const onClickConfirm = async () => {
      clearErrors()
      let error = false
      if (!images || images.length === 0) {
        addError({ images: 'Необходимо загрузить хотябы одно фото' })
        error = true
      }
      if (!directionId) {
        addError({ direction: 'Необходимо выбрать направление мероприятия' })
        error = true
      }
      if (!title) {
        addError({ title: 'Необходимо ввести название' })
        error = true
      }
      if (!description) {
        addError({ description: 'Необходимо ввести описание' })
        error = true
      }
      if (!date) {
        addError({ date: 'Необходимо ввести дату' })
        error = true
      }
      if (!error) {
        closeModal()
        setEvent(
          {
            _id: event?._id,
            images,
            title,
            description,
            showOnSite,
            date,
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
      setOnConfirmFunc(onClickConfirm)
    }, [
      title,
      description,
      showOnSite,
      date,
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
    //             onChange={(tmages) => {
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
          className="duration-0 bg-gray-200"
        >
          {/* {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))} */}
          <Tab key="general" value="general" className="font-bold italic">
            Общие
          </Tab>
          <Tab key="access" value="access" className="font-bold italic">
            Доступ и стоимость
          </Tab>
          {eventId && (
            <Tab key="status" value="status" className="font-bold italic">
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
                onChange={(tmages) => {
                  removeError('images')
                  setImages(images)
                }}
                required
                error={errors.images}
              />
              <SelectDirection
                selectedId={directionId}
                onChange={(direction) => {
                  removeError('direction')
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
              <SelectUser
                label="Организатор"
                selectedId={organizerId}
                onChange={(user) => setOrganizerId(user._id)}
                required
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
                  <>
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
                  </>
                )}
              </FormWrapper>
              <FormWrapper flex className="min-h-[26px]">
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
                  <>
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
                  </>
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
          <TabPanel value="status">
            {eventId && (
              <FormWrapper>
                <EventStatusPicker
                  required
                  status={status}
                  onChange={setStatus}
                />
              </FormWrapper>
            )}
          </TabPanel>
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
