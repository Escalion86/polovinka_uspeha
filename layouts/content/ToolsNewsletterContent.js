'use client'

// import Button from '@components/Button'
// import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus'
// import { faMars } from '@fortawesome/free-solid-svg-icons/faMars'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtomValue } from 'jotai'
// import { useMemo, useState, useCallback } from 'react'
// import UserStatusIcon from '@components/UserStatusIcon'
// import SvgSigma from '@svg/SvgSigma'
// import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
// import { postData } from '@helpers/CRUD'
// import locationAtom from '@state/atoms/locationAtom'
// import EditableTextarea from '@components/EditableTextarea'
// import convertHtmlToText from '@helpers/convertHtmlToText'
// import pasteFromClipboard from '@helpers/pasteFromClipboard'
import Button from '@components/Button'
import { getNounNewsletters } from '@helpers/getNoun'
// import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
// import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
// import Divider from '@components/Divider'
// import { faCancel } from '@fortawesome/free-solid-svg-icons/faCancel'
// import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
// import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
// import useSnackbar from '@helpers/useSnackbar'
// import usersAtomAsync from '@state/async/usersAtomAsync'
// import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
// import CheckBox from '@components/CheckBox'
import ContentHeader from '@components/ContentHeader'
import newslettersAtomAsync from '@state/async/newslettersAtomAsync'
import NewslettersList from '@layouts/lists/NewslettersList'
import AddButton from '@components/IconToggleButtons/AddButton'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import SortingButtonMenu from '@components/SortingButtonMenu'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import locationAtom from '@state/atoms/locationAtom'
import useSnackbar from '@helpers/useSnackbar'
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import {
  NEWSLETTER_SENDING_STATUS_LABELS,
  NEWSLETTER_SENDING_STATUSES,
} from '@helpers/constantsNewsletters'

// const getUsersData = (users) => {
//   const mans = users.filter((user) => user.gender === 'male')
//   const womans = users.filter((user) => user.gender === 'famale')
//   const unknownGender = users.filter(
//     (user) => user.gender !== 'male' && user.gender !== 'famale'
//   )
//   const mansMember = mans.filter((user) => user.status === 'member').length
//   const womansMember = womans.filter((user) => user.status === 'member').length
//   const unknownGenderMember = unknownGender.filter(
//     (user) => user.status === 'member'
//   ).length
//   const mansNovice = mans.length - mansMember
//   const womansNovice = womans.length - womansMember
//   const unknownGenderNovice = unknownGender.length - unknownGenderMember

//   const novice = mansNovice + womansNovice + unknownGenderNovice
//   const member = mansMember + womansMember + unknownGenderMember
//   const total = users.length

//   return {
//     mans: mans.length,
//     womans: womans.length,
//     unknownGender: unknownGender.length,
//     mansMember,
//     womansMember,
//     unknownGenderMember,
//     mansNovice,
//     womansNovice,
//     unknownGenderNovice,
//     novice,
//     member,
//     total,
//   }
// }

const ToolsNewsletterContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const newsletters = useAtomValue(newslettersAtomAsync)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const location = useAtomValue(locationAtom)
  const {
    success: notifySuccess,
    info: notifyInfo,
    error: notifyError,
  } = useSnackbar()
  const addButton = loggedUserActiveRole?.newsletters?.add

  const statusButtonsConfig = useMemo(
    () => [
      {
        value: NEWSLETTER_SENDING_STATUSES.DRAFT,
        name: NEWSLETTER_SENDING_STATUS_LABELS[
          NEWSLETTER_SENDING_STATUSES.DRAFT
        ],
        color: 'warning',
      },
      {
        value: NEWSLETTER_SENDING_STATUSES.WAITING,
        name: NEWSLETTER_SENDING_STATUS_LABELS[
          NEWSLETTER_SENDING_STATUSES.WAITING
        ],
        color: 'primary',
      },
      {
        value: NEWSLETTER_SENDING_STATUSES.SENT,
        name: NEWSLETTER_SENDING_STATUS_LABELS[
          NEWSLETTER_SENDING_STATUSES.SENT
        ],
        color: 'success',
      },
    ],
    []
  )

  const [statusFilter, setStatusFilter] = useState(() =>
    statusButtonsConfig.reduce(
      (acc, cfg) => ({ ...acc, [cfg.value]: true }),
      {}
    )
  )

  const [sort, setSort] = useState({ newsletterSendDate: 'desc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])
  const [messagesCount, setMessagesCount] = useState(null)
  const [isCountLoading, setIsCountLoading] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [instanceState, setInstanceState] = useState(null)
  const [isStateLoading, setIsStateLoading] = useState(false)
  const [isAuthorizationLoading, setIsAuthorizationLoading] = useState(false)
  const isAuthorized = instanceState === 'authorized'

  const fetchMessagesCount = useCallback(async () => {
    if (!location) return
    setIsCountLoading(true)
    try {
      const response = await fetch(`/api/${location}/newsletters/queue`)
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Ошибка запроса')
      }
      setMessagesCount(result?.data?.totalMessages ?? 0)
    } catch (error) {
      notifyError('Не удалось обновить счётчик сообщений')
    } finally {
      setIsCountLoading(false)
    }
  }, [location, notifyError])

  const fetchInstanceState = useCallback(async () => {
    if (!location) return
    setIsStateLoading(true)
    try {
      const response = await fetch(`/api/${location}/newsletters/state`)
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Ошибка получения статуса')
      }
      setInstanceState(result?.data?.stateInstance || null)
    } catch (error) {
      setInstanceState('needPaymentOrServer')
    } finally {
      setIsStateLoading(false)
    }
  }, [location])

  const handleStopNewsletter = useCallback(async () => {
    if (!location || isStopping) return
    setIsStopping(true)
    try {
      const response = await fetch(`/api/${location}/newsletters/queue`, {
        method: 'POST',
      })
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Ошибка остановки')
      }
      notifySuccess('Рассылка остановлена')
      if (isAuthorized) {
        await fetchMessagesCount()
      }
      fetchInstanceState()
    } catch (error) {
      notifyError('Не удалось остановить рассылку')
    } finally {
      setIsStopping(false)
    }
  }, [
    fetchInstanceState,
    fetchMessagesCount,
    isAuthorized,
    isStopping,
    location,
    notifyError,
    notifySuccess,
  ])
  const handleRequestAuthorization = useCallback(async () => {
    if (!location || isAuthorizationLoading) return
    const phoneNumber =
      typeof window !== 'undefined'
        ? window.prompt('Введите номер телефона (формат без + и 00)')
        : null
    if (!phoneNumber) return
    setIsAuthorizationLoading(true)
    try {
      const response = await fetch(`/api/${location}/newsletters/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Ошибка авторизации')
      }
      const code = result?.data?.code
      notifySuccess('Код авторизации получен')
      modalsFunc.add({
        title: 'Код авторизации',
        text: code ? `Код: ${code}` : 'Код не получен. Попробуйте снова.',
        confirmButtonName: 'Скопировать код в буфер',
        onConfirm: () => {
          navigator.clipboard.writeText(code)
          notifyInfo('Код скопирован в буфер обмена')
        },
        showDecline: false,
      })
      fetchInstanceState()
    } catch (error) {
      notifyError('Не удалось запросить код авторизации')
    } finally {
      setIsAuthorizationLoading(false)
    }
  }, [
    fetchInstanceState,
    isAuthorizationLoading,
    location,
    modalsFunc,
    notifyError,
    notifySuccess,
  ])

  const handleRefreshNewslettersData = useCallback(() => {
    fetchInstanceState()
    if (isAuthorized) {
      fetchMessagesCount()
    }
  }, [fetchInstanceState, fetchMessagesCount, isAuthorized])

  const fetchedStateLocationRef = useRef(null)
  useEffect(() => {
    if (!location) return
    if (fetchedStateLocationRef.current === location) return
    fetchedStateLocationRef.current = location
    fetchInstanceState()
  }, [fetchInstanceState, location])

  useEffect(() => {
    if (isAuthorized) {
      fetchMessagesCount()
    }
  }, [fetchMessagesCount, isAuthorized])

  const newslettersLength = newsletters?.length ?? 0
  const prevLengthRef = useRef(newslettersLength)
  useEffect(() => {
    if (newslettersLength > prevLengthRef.current) {
      if (isAuthorized) {
        fetchMessagesCount()
      }
      fetchInstanceState()
    }
    prevLengthRef.current = newslettersLength
  }, [fetchInstanceState, fetchMessagesCount, isAuthorized, newslettersLength])

  const getSendingStatusValue = useCallback(
    (newsletter) =>
      newsletter?.sendingStatus ||
      (newsletter?.status === 'active'
        ? NEWSLETTER_SENDING_STATUSES.SENT
        : null),
    []
  )

  const filteredNewsletters = useMemo(
    () =>
      (newsletters || []).filter((newsletter) => {
        const status = getSendingStatusValue(newsletter)
        if (!status) return true
        return statusFilter[status] ?? true
      }),
    [getSendingStatusValue, newsletters, statusFilter]
  )

  const sortedNewsletters = useMemo(() => {
    const list = [...filteredNewsletters]
    if (!sortFunc) return list
    return list.sort(sortFunc)
  }, [filteredNewsletters, sortFunc])

  const displayMessagesCount =
    messagesCount === null || messagesCount === undefined ? '-' : messagesCount

  const STATE_LABELS = {
    needPaymentOrServer: 'Не оплачен, либо нет связи с сервером рассылки',
    needPayment: 'Необходимо оплатить',
    notAuthorized: 'Не авторизован',
    authorized: 'Авторизован',
    blocked: 'Блокировка',
    sleepMode: 'Спящий режим',
    starting: 'Сервисный режим',
    yellowCard: 'Частично приостановлен',
  }

  const stateLabel =
    instanceState && STATE_LABELS[instanceState]
      ? STATE_LABELS[instanceState]
      : instanceState || '-'

  return (
    <>
      <ContentHeader>
        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {isAuthorized && displayMessagesCount > 0 && (
                <Button
                  name="Остановить рассылку"
                  onClick={handleStopNewsletter}
                  loading={isStopping}
                  disabled={!location}
                  thin
                  icon={faStop}
                />
              )}
              {instanceState === 'notAuthorized' && (
                <Button
                  name="Авторизация"
                  onClick={handleRequestAuthorization}
                  loading={isAuthorizationLoading}
                  disabled={!location}
                  thin
                  classBgColor="bg-blue-600"
                  classHoverBgColor="hover:bg-blue-700"
                  icon={faKey}
                />
              )}
              <div className="flex flex-wrap items-center gap-1 text-sm text-general">
                <Button
                  onClick={handleRefreshNewslettersData}
                  loading={isCountLoading || isStateLoading}
                  thin
                  icon={faRotateRight}
                />
                <span className="flex items-center gap-1 text-black">
                  Статус WA:{' '}
                  <span className="font-semibold">
                    {isStateLoading ? '...' : stateLabel}
                  </span>
                </span>
                {isAuthorized && (
                  <span className="flex items-center gap-1 pl-1 text-black border-l border-gray-400">
                    Отправляется:{' '}
                    <span className="font-semibold">
                      {isCountLoading ? '...' : displayMessagesCount}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ToggleButtons
              value={statusFilter}
              onChange={setStatusFilter}
              buttonsConfig={statusButtonsConfig}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-bold whitespace-nowrap">
                {getNounNewsletters(sortedNewsletters.length)}
              </div>
              <SortingButtonMenu
                sort={sort}
                onChange={setSort}
                sortKeys={['newsletterSendDate', 'createdAt']}
              />
              {addButton && (
                <AddButton
                  onClick={() =>
                    modalsFunc.newsletter.add(undefined, {
                      whatsappAuthorized: isAuthorized,
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>
      </ContentHeader>
      <NewslettersList newsletters={sortedNewsletters} />
    </>
  )
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  // const location = useAtomValue(locationAtom)
  // const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  // const { success, error } = useSnackbar()
  // const users = useAtomValue(usersAtomAsync)

  // const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)

  // const blackList = siteSettings?.newsletter?.blackList || []

  // const [checkBlackList, setCheckBlackList] = useState(true)

  // const [selectedUsers, setSelectedUsers] = useState([])
  // // const [blackList, setBlackList] = useState([])
  // const [message, setMessage] = useState('')
  // const [rerender, setRerender] = useState(false)

  // const toggleRerender = () => setRerender((state) => !state)

  // const filteredSelectedUsers = useMemo(() => {
  //   if (!checkBlackList) return selectedUsers
  //   return selectedUsers.filter((user) => !blackList.includes(user._id))
  // }, [selectedUsers, blackList, checkBlackList])

  // const selectedUsersData = useMemo(
  //   () => getUsersData(filteredSelectedUsers),
  //   [filteredSelectedUsers]
  // )

  // const setBlackList = useCallback(
  //   async (usersIdsBlackList) => {
  //     await postData(
  //       `/api/${location}/site`,
  //       {
  //         newsletter: {
  //           ...siteSettings.newsletter,
  //           blackList: usersIdsBlackList,
  //         },
  //       },
  //       (data) => {
  //         setSiteSettings(data)
  //         success('Черный список обновлен')
  //         // setMessage('Данные черного списка обновлены успешно')
  //         // setIsWaitingToResponse(false)
  //         // refreshPage()
  //       },
  //       () => {
  //         error('Ошибка обновления черного списка')
  //         // setMessage('')
  //         // addError({ response: 'Ошибка обновления данных черного списка' })
  //         // setIsWaitingToResponse(false)
  //       },
  //       false,
  //       loggedUserActive?._id
  //     )
  //   },
  //   [location, loggedUserActive]
  // )

  // // const blackListData = useMemo(() => getUsersData(blackList), [blackList])

  // const sendMessage = async (message) => {
  //   // const result = []

  //   // for (let i = 0; i < filteredSelectedUsers.length; i++) {
  //   //   const user = filteredSelectedUsers[i]
  //   const res = await postData(`/api/${location}/newsletters/sendMessage`, {
  //     // phone: user.whatsapp || user.phone,
  //     usersMessages: filteredSelectedUsers.map((user) => ({
  //       userId: user._id,
  //       whatsappPhone: user.whatsapp || user.phone,
  //       whatsappMessage: message,
  //     })),
  //   })

  //   success('Рассылка отправлена')
  //   //   const idMessage = res?.idMessage
  //   //   result.push({ userId: user._id, message, idMessage })
  //   // }
  //   console.log('res :>> ', res)
  //   // Example
  //   // res :>>  [
  //   //   {
  //   //     userId: '6252f733183ed7f8da6baa54',
  //   //     success: true,
  //   //     resp: { idMessage: 'BAE5E9A4F28119D2' }
  //   //   }
  //   // ]
  //   return res
  // }

  // const Component = useCallback(
  //   (props) => <EditableTextarea {...props} />,
  //   [rerender]
  // )

  // const blockedUsersCount = selectedUsers.length - filteredSelectedUsers.length

  // if (!siteSettings?.newsletter?.whatsappActivated)
  //   return <div>Рассылка на Whatsapp не доступна</div>

  // return (
  //   <div className="flex flex-col px-1 py-1 overflow-y-auto gap-y-1">
  //     <Divider title="Список пользователей" light thin />
  //     <div className="flex flex-wrap gap-x-1 gap-y-1">
  //       <div className="flex flex-col gap-y-1">
  //         <Button
  //           name="Редактировать список"
  //           icon={faPencil}
  //           onClick={() =>
  //             modalsFunc.selectUsers(
  //               selectedUsers,
  //               {},
  //               setSelectedUsers,
  //               [] //exceptedIds,
  //               //acceptedIds,
  //               // maxUsers,
  //               // canSelectNone,
  //               // modalTitle,
  //               // showCountNumber
  //             )
  //           }
  //         />
  //         <Button
  //           name="Выбрать из мероприятия"
  //           icon={faCalendarAlt}
  //           onClick={() =>
  //             modalsFunc.selectEvents(
  //               [],
  //               null,
  //               async (data) => {
  //                 const eventId = data[0]
  //                 modalsFunc.selectUsersByStatusesFromEvent(
  //                   eventId,
  //                   setSelectedUsers
  //                 )
  //                 // setSelectedUsers(users)
  //               },
  //               [],
  //               null,
  //               1,
  //               false,
  //               'Выбрать пользователей из мероприятия...'
  //               // itemsId,
  //               // filterRules,
  //               // onChange,
  //               // exceptedIds,
  //               // acceptedIds,
  //               // maxEvents,
  //               // canSelectNone,
  //               // modalTitle,
  //               // showCountNumber
  //             )
  //           }
  //         />

  //         {checkBlackList && (
  //           <>
  //             <Button
  //               name={'Черный список (' + blackList.length + ' чел.)'}
  //               icon={faCancel}
  //               onClick={() =>
  //                 modalsFunc.selectUsers(
  //                   users.filter((user) => blackList.includes(user._id)),
  //                   {},
  //                   (users) => {
  //                     const usersIds = users.map((user) => user._id)
  //                     setBlackList(usersIds)
  //                   },
  //                   [], //exceptedIds
  //                   undefined, //acceptedIds
  //                   undefined, // maxUsers
  //                   true, // canSelectNone
  //                   'Выбор черного списка', //  modalTitle
  //                   false // getFullUser
  //                 )
  //               }
  //             />
  //             {blockedUsersCount > 0 && (
  //               <div className="flex text-danger">
  //                 Отфильтровано: {getNounUsers(blockedUsersCount)}
  //               </div>
  //             )}
  //           </>
  //         )}
  //         <CheckBox
  //           label="Использовать черный список"
  //           checked={checkBlackList}
  //           onChange={() => setCheckBlackList((checked) => !checked)}
  //           noMargin
  //         />
  //       </div>

  //       <div className="flex flex-wrap items-center gap-1">
  //         <div className="w-fit grid grid-cols-[30px_64px_64px_64px] grid-rows-[30px_30px_30px_30px_30px] items-stretch justify-center overflow-hidden border rounded-lg border-general">
  //           <div className="border-b border-r" />
  //           <div className="flex items-center justify-center border-b border-r gap-x-1">
  //             <UserStatusIcon size="xs" status="novice" />
  //           </div>
  //           <div className="flex items-center justify-center border-b border-r gap-x-1">
  //             <UserStatusIcon size="xs" status="member" />
  //           </div>
  //           <div className="flex items-center justify-center border-b">
  //             <div className="w-5 h-5 min-w-5">
  //               <SvgSigma className="fill-general" />
  //             </div>
  //           </div>
  //           <div className="flex items-center justify-center border-b border-r">
  //             <FontAwesomeIcon
  //               icon={faMars}
  //               className="w-6 h-6 text-blue-600"
  //             />
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.mansNovice}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.mansMember}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b bg-general/10">
  //             {selectedUsersData.mans}
  //           </div>
  //           <div className="flex items-center justify-center border-b border-r">
  //             <FontAwesomeIcon
  //               icon={faVenus}
  //               className="w-6 h-6 text-red-600"
  //             />
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.womansNovice}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.womansMember}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b bg-general/10">
  //             {selectedUsersData.womans}
  //           </div>
  //           <div className="flex items-center justify-center border-b border-r">
  //             <FontAwesomeIcon
  //               icon={faGenderless}
  //               className="w-6 h-6 text-gray-400"
  //             />
  //           </div>

  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.unknownGenderNovice}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b border-r">
  //             {selectedUsersData.unknownGenderMember}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-b bg-general/10">
  //             {selectedUsersData.unknownGender}
  //           </div>
  //           <div className="flex items-center justify-center border-r">
  //             <div className="w-5 h-5 min-w-5">
  //               <SvgSigma className="fill-general" />
  //             </div>
  //           </div>
  //           <div className="flex items-center justify-center text-center border-r bg-general/10">
  //             {selectedUsersData.novice}
  //           </div>
  //           <div className="flex items-center justify-center text-center border-r bg-general/10">
  //             {selectedUsersData.member}
  //           </div>
  //           <div className="flex items-center justify-center font-bold text-center bg-general/20">
  //             {selectedUsersData.total}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <Divider title="Текст сообщения" light thin />
  //     <div>
  //       <Button
  //         name="Вставить текст из буфера"
  //         icon={faPaste}
  //         onClick={async () => {
  //           await pasteFromClipboard(setMessage)
  //           toggleRerender()
  //         }}
  //       />
  //     </div>
  //     <div>
  //       <Component
  //         label="Сообщение"
  //         html={message}
  //         onChange={setMessage}
  //         // placeholder="Описание мероприятия..."
  //         required
  //       />
  //     </div>
  //     <div>
  //       <Button
  //         disabled={!message || !filteredSelectedUsers?.length}
  //         name="Отправить сообщение"
  //         onClick={() => {
  //           modalsFunc.confirm({
  //             title: 'Отправка сообщений на Whatsapp пользователям',
  //             text: `Вы уверены, что хотите сообщение ${getNoun(filteredSelectedUsers?.length, 'пользователю', 'пользователям', 'пользователям')}?`,
  //             onConfirm: () => {
  //               const prepearedText = DOMPurify.sanitize(
  //                 convertHtmlToText(message, 'whatsapp'),
  //                 {
  //                   ALLOWED_TAGS: [],
  //                   ALLOWED_ATTR: [],
  //                 }
  //               )
  //               sendMessage(prepearedText)
  //             },
  //           })
  //         }}
  //       />
  //     </div>
  //   </div>
  // )
}

export default ToolsNewsletterContent
