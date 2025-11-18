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
import { useEffect, useMemo, useRef, useState } from 'react'

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

const areNewslettersEqual = (prev, next) => {
  if (prev === next) return true
  if (!Array.isArray(prev) || !Array.isArray(next)) return false
  if (prev.length !== next.length) return false

  for (let i = 0; i < prev.length; i += 1) {
    const prevItem = prev[i]
    const nextItem = next[i]

    if (prevItem === nextItem) continue
    if (!prevItem || !nextItem) return false
    if (prevItem._id !== nextItem._id) return false
    if (JSON.stringify(prevItem) !== JSON.stringify(nextItem)) return false
  }

  return true
}

const ToolsNewsletterContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const newslettersSource = useAtomValue(newslettersAtomAsync)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.newsletters?.add

  const [sort, setSort] = useState({ createdAt: 'desc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])
  const debugNewsletters =
    process.env.NEXT_PUBLIC_DEBUG_NEWSLETTERS === 'true'

  const stableNewslettersRef = useRef()
  const rawNewslettersRef = useRef()
  const sortedNewslettersRef = useRef()

  const newsletters = useMemo(() => {
    const normalized = Array.isArray(newslettersSource)
      ? newslettersSource
      : []

    const prev = stableNewslettersRef.current
    if (areNewslettersEqual(prev, normalized)) return prev ?? normalized

    stableNewslettersRef.current = normalized
    return normalized
  }, [newslettersSource])

  const sortedNewsletters = useMemo(() => {
    if (!Array.isArray(newsletters)) return []
    return [...newsletters].sort(sortFunc)
  }, [newsletters, sortFunc])

  useEffect(() => {
    if (!debugNewsletters) return
    const prev = rawNewslettersRef.current
    rawNewslettersRef.current = newsletters
    console.debug('[Newsletters][raw] изменился источник', {
      time: new Date().toISOString(),
      prevLength: prev?.length ?? 0,
      nextLength: newsletters?.length ?? 0,
      prevFirstId: prev?.[0]?._id,
      nextFirstId: newsletters?.[0]?._id,
    })
  }, [newsletters, debugNewsletters])

  useEffect(() => {
    if (!debugNewsletters) return
    const prev = sortedNewslettersRef.current
    sortedNewslettersRef.current = sortedNewsletters
    const prevIds = prev?.slice(0, 5).map((item) => item?._id)
    const nextIds = sortedNewsletters?.slice(0, 5).map((item) => item?._id)

    console.debug('[Newsletters][sorted] обновился список', {
      time: new Date().toISOString(),
      prevLength: prev?.length ?? 0,
      nextLength: sortedNewsletters?.length ?? 0,
      prevSampleIds: prevIds,
      nextSampleIds: nextIds,
      sort,
    })
  }, [debugNewsletters, sort, sortedNewsletters])

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounNewsletters(newsletters?.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['createdAt']}
          />
          {addButton && (
            <AddButton onClick={() => modalsFunc.newsletter.add()} />
          )}
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
