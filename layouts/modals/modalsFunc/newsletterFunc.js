'use client'

import Button from '@components/Button'
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus'
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo, useState, useCallback, useEffect } from 'react'
import UserStatusIcon from '@components/UserStatusIcon'
import SvgSigma from '@svg/SvgSigma'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import EditableTextarea from '@components/EditableTextarea'
import convertHtmlToText from '@helpers/convertHtmlToText'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import getNoun, { getNounUsers } from '@helpers/getNoun'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
// import Divider from '@components/Divider'
import { faCancel } from '@fortawesome/free-solid-svg-icons/faCancel'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import useSnackbar from '@helpers/useSnackbar'
import usersAtomAsync from '@state/async/usersAtomAsync'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import itemsFuncAtom from '@state/itemsFuncAtom'
import { faHandshake } from '@fortawesome/free-solid-svg-icons/faHandshake'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import extractVariables from '@helpers/extractVariables'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import newsletterSelector from '@state/selectors/newsletterSelector'

const getUsersData = (users) => {
  const mans = users.filter((user) => user.gender === 'male')
  const womans = users.filter((user) => user.gender === 'famale')
  const unknownGender = users.filter(
    (user) => user.gender !== 'male' && user.gender !== 'famale'
  )
  const mansMember = mans.filter((user) => user.status === 'member').length
  const womansMember = womans.filter((user) => user.status === 'member').length
  const unknownGenderMember = unknownGender.filter(
    (user) => user.status === 'member'
  ).length
  const mansNovice = mans.length - mansMember
  const womansNovice = womans.length - womansMember
  const unknownGenderNovice = unknownGender.length - unknownGenderMember

  const novice = mansNovice + womansNovice + unknownGenderNovice
  const member = mansMember + womansMember + unknownGenderMember
  const total = users.length

  return {
    mans: mans.length,
    womans: womans.length,
    unknownGender: unknownGender.length,
    mansMember,
    womansMember,
    unknownGenderMember,
    mansNovice,
    womansNovice,
    unknownGenderNovice,
    novice,
    member,
    total,
  }
}

const newsletterFunc = (newsletterId, { name, users, event }) => {
  const NewsletterModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setBottomLeftButtonProps,
    setTopLeftComponent,
  }) => {
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const newsletter = useAtomValue(newsletterSelector(newsletterId))
    const location = useAtomValue(locationAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const { info, success, error } = useSnackbar()
    const usersAll = useAtomValue(usersAtomAsync)
    const setNewsletter = useAtomValue(itemsFuncAtom).newsletter.set

    const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)

    const blackList = siteSettings?.newsletter?.blackList || []

    const [checkBlackList, setCheckBlackList] = useState(true)
    const [previewVariables, setPreviewVariables] = useState({
      муж: true,
      клуб: true,
      пара: true,
    })

    const defaultNameState = useMemo(
      () =>
        newsletter?.name
          ? newsletter.name
          : name || (event ? `Мероприятие "${event.title}"` : ''),
      [name, event]
    )

    const [newsletterName, setNewsletterName] = useState(defaultNameState)

    const [selectedUsers, setSelectedUsers] = useState(() =>
      newsletter?.newsletters
        ? newsletter.newsletters.map(({ userId }) =>
            usersAll.find((user) => user._id === userId)
          )
        : users || []
    )

    const defaultMessageState = useMemo(
      () =>
        newsletter?.message
          ? newsletter.message
          : event
            ? `<b>Мероприятие "${event.title}"</b><br><br>${event.description}`
            : '',
      [event]
    )
    // const [blackList, setBlackList] = useState([])
    const [message, setMessage] = useState(defaultMessageState)
    const [rerender, setRerender] = useState(false)

    const toggleRerender = () => setRerender((state) => !state)

    const filteredSelectedUsers = useMemo(() => {
      if (!checkBlackList) return selectedUsers
      return selectedUsers.filter((user) => !blackList.includes(user._id))
    }, [selectedUsers, blackList, checkBlackList])

    const selectedUsersData = useMemo(
      () => getUsersData(filteredSelectedUsers),
      [filteredSelectedUsers]
    )

    const setBlackList = useCallback(
      async (usersIdsBlackList) => {
        await postData(
          `/api/${location}/site`,
          {
            newsletter: {
              ...siteSettings.newsletter,
              blackList: usersIdsBlackList,
            },
          },
          (data) => {
            setSiteSettings(data)
            success('Черный список обновлен')
            // setMessage('Данные черного списка обновлены успешно')
            // setIsWaitingToResponse(false)
            // refreshPage()
          },
          () => {
            error('Ошибка обновления черного списка')
            // setMessage('')
            // addError({ response: 'Ошибка обновления данных черного списка' })
            // setIsWaitingToResponse(false)
          },
          false,
          loggedUserActive?._id
        )
      },
      [location, loggedUserActive]
    )

    const prepearedText = useMemo(
      () =>
        DOMPurify.sanitize(message, {
          ALLOWED_TAGS: ['b', 'i', 's', 'strong', 'br', 'p', 'em'],
          ALLOWED_ATTR: [],
        }),
      [message]
    )

    const preview = useMemo(
      () => replaceVariableInTextTemplate(prepearedText, previewVariables),
      [prepearedText, previewVariables]
    )

    const sendMessage = async (name, message) => {
      // const result = []

      // for (let i = 0; i < filteredSelectedUsers.length; i++) {
      //   const user = filteredSelectedUsers[i]

      const variables = extractVariables(prepearedText)

      const variablesObject = {}
      for (let i = 0; i < variables.length; i++) {
        const varName = variables[i]
        variablesObject[varName] = true
      }

      // const testUsers = filteredSelectedUsers.map((user) => ({
      //   userId: user._id,
      //   whatsappPhone: user.whatsapp || user.phone,
      //   variables: {
      //     ...(variablesObject.mуж ? { муж: user.gender === 'male' } : {}),
      //     ...(variablesObject.клуб ? { клуб: user.status === 'member' } : {}),
      //     ...(variablesObject.пара ? { пара: !!user.relationship } : {}),
      //   },
      // }))

      // console.log('testUsers :>> ', testUsers)

      // const preview = replaceVariableInTextTemplate(
      //   prepearedText,
      //   variablesObject
      // )

      const res = postData(
        `/api/${location}/newsletters/byType/sendMessage`,
        {
          // phone: user.whatsapp || user.phone,
          name,
          usersMessages: filteredSelectedUsers.map((user) => ({
            userId: user._id,
            whatsappPhone: user.whatsapp || user.phone,
            variables: {
              ...(variablesObject.муж ? { муж: user.gender === 'male' } : {}),
              ...(variablesObject.клуб
                ? { клуб: user.status === 'member' }
                : {}),
              ...(variablesObject.пара ? { пара: !!user.relationship } : {}),
            },
            // whatsappMessage: message,
          })),
          message,
        },
        (data) => {
          // success('Рассылка отправлена успешно')
          setNewsletter(data)
        },
        (data) => {
          error('Ошибка отправки рассылки! Ответ сервиса: ' + data)
        }
      )

      closeModal()
      info(
        'Рассылка отправлена и после обработки запроса появится в списке рассылок'
      )
      //   const idMessage = res?.idMessage
      //   result.push({ userId: user._id, message, idMessage })
      // }
      // console.log('res :>> ', res)
      // return res
    }

    const Component = useCallback(
      (props) => <EditableTextarea {...props} />,
      [rerender]
    )

    // const customButtons = undefined

    const customButtons = useMemo(() => {
      return {
        handlers: {
          клуб: function (value) {
            // const range = this.quill.getSelection()
            // if (range) {
            //   if (range.length == 0) {
            //     console.log('User cursor is at index', range.index)
            //   } else {
            //     const text = this.quill.getText(range.index, range.length)
            //     console.log('User has highlighted: ', text)
            //   }
            // } else {
            //   console.log('User cursor is not in editor')
            // }
            if (value) {
              const text1 = prompt('Введите текст для пользователя из клуба')
              if (text1 === null) return
              const text2 = prompt('Введите текст для пользователя из центра')
              if (text2 === null) return
              if (text1 === '' && text2 === '') return
              // this.quill.getBounds
              const range = this.quill.getSelection()
              if (text2) {
                this.quill.insertText(range.index, '}', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, text2, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, '{', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
              }
              this.quill.insertText(range.index, '}', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              if (text1)
                this.quill.insertText(range.index, text1, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
              this.quill.insertText(range.index, '}{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, 'клуб', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, '{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
            }
          },
          муж: function (value) {
            if (value) {
              const text1 = prompt(
                'Введите текст если пользователь мужского пола'
              )
              if (text1 === null) return
              const text2 = prompt(
                'Введите текст если пользователь женского пола'
              )
              if (text2 === null) return
              if (text1 === '' && text2 === '') return
              const range = this.quill.getSelection()
              if (text2) {
                this.quill.insertText(range.index, '}', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, text2, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, '{', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
              }
              this.quill.insertText(range.index, '}', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              if (text1)
                this.quill.insertText(range.index, text1, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
              this.quill.insertText(range.index, '}{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, 'муж', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, '{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
            }
          },
          пара: function (value) {
            if (value) {
              const text1 = prompt('Введите текст если пользователь в паре')
              if (text1 === null) return
              const text2 = prompt('Введите текст если пользователь без пары')
              if (text2 === null) return
              if (text1 === '' && text2 === '') return
              const range = this.quill.getSelection()
              if (text2) {
                this.quill.insertText(range.index, '}', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, text2, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
                this.quill.insertText(range.index, '{', {
                  color: 'white',
                  background: '#7a5151',
                  italic: false,
                  bold: false,
                })
              }
              this.quill.insertText(range.index, '}', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              if (text1)
                this.quill.insertText(range.index, text1, {
                  color: false,
                  background: false,
                  italic: false,
                  bold: false,
                })
              this.quill.insertText(range.index, '}{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, 'пара', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
              this.quill.insertText(range.index, '{', {
                color: 'white',
                background: '#7a5151',
                italic: false,
                bold: false,
              })
            }
          },
        },
        container: [['клуб'], ['муж'], ['пара']],
      }
    }, [])

    const blockedUsersCount =
      selectedUsers.length - filteredSelectedUsers.length

    const copyResult = useCopyToClipboard(
      DOMPurify.sanitize(
        message
          .replaceAll('<p><br></p>', '\n')
          .replaceAll('<blockquote>', '\n<blockquote>')
          .replaceAll('<li>', '\n\u{2764} <li>')
          .replaceAll('<p>', '\n<p>')
          .replaceAll('<br>', '\n')
          .replaceAll('&nbsp;', ' ')
          .trim('\n'),
        {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        }
      ),
      'Результат скопирован в буфер обмена'
    )

    useEffect(() => {
      if (
        !newsletterName ||
        !message ||
        !filteredSelectedUsers?.length ||
        !siteSettings?.newsletter?.whatsappActivated ||
        !loggedUserActiveRole?.newsletters?.add
      ) {
        setOnConfirmFunc()
      } else {
        const prepearedText = DOMPurify.sanitize(
          convertHtmlToText(message, 'whatsapp'),
          {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
          }
        )

        if (!prepearedText) {
          setOnConfirmFunc()
        } else {
          setOnConfirmFunc(() =>
            modalsFunc.confirm({
              title: 'Отправка сообщений на Whatsapp пользователям',
              text: `Вы уверены, что хотите отправить сообщение ${getNoun(filteredSelectedUsers?.length, 'пользователю', 'пользователям', 'пользователям')} на Whatsapp?`,
              onConfirm: () => {
                sendMessage(newsletterName, prepearedText)
              },
            })
          )
        }
      }
    }, [newsletterName, message, filteredSelectedUsers?.length, siteSettings])

    if (
      !siteSettings?.newsletter?.whatsappActivated ||
      !loggedUserActiveRole?.newsletters?.add
    )
      return <div>Рассылка на Whatsapp не доступна</div>

    useEffect(() => {
      setBottomLeftButtonProps({
        name: 'Скопировать сообщение (html) в буфер',
        classBgColor: 'bg-general',
        icon: faCopy,
        onClick: () => copyResult(),
      })
    }, [message])

    return (
      <div className="flex flex-col px-1 py-1 overflow-y-auto gap-y-1">
        {/* <Divider title="Список пользователей" light thin /> */}
        <InputWrapper label="Список пользователей">
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            <div className="flex flex-col gap-y-1">
              <Button
                name="Редактировать список"
                icon={faPencil}
                onClick={() =>
                  modalsFunc.selectUsers(
                    selectedUsers,
                    {},
                    setSelectedUsers,
                    [] //exceptedIds,
                    //acceptedIds,
                    // maxUsers,
                    // canSelectNone,
                    // modalTitle,
                    // showCountNumber
                  )
                }
              />
              <Button
                name="Выбрать из мероприятия"
                icon={faCalendarAlt}
                onClick={() =>
                  modalsFunc.selectEvents(
                    [],
                    null,
                    async (data) => {
                      const eventId = data[0]
                      modalsFunc.selectUsersByStatusesFromEvent(
                        eventId,
                        (users, event) => setSelectedUsers(users)
                      )
                      // setSelectedUsers(users)
                    },
                    [],
                    null,
                    1,
                    false,
                    'Выбрать пользователей из мероприятия'
                    // itemsId,
                    // filterRules,
                    // onChange,
                    // exceptedIds,
                    // acceptedIds,
                    // maxEvents,
                    // canSelectNone,
                    // modalTitle,
                    // showCountNumber
                  )
                }
              />
              <Button
                name="Выбрать из подавших заявку на услугу"
                icon={faHandshake}
                onClick={() =>
                  modalsFunc.selectServices(
                    [],
                    null,
                    async (data) => {
                      const serviceId = data[0]
                      modalsFunc.selectUsersByStatusesFromService(
                        serviceId,
                        (users, service) => setSelectedUsers(users)
                      )
                    },
                    [],
                    null,
                    1,
                    false,
                    'Выбрать пользователей из подавших заявку на услугу'
                    // itemsId,
                    // filterRules,
                    // onChange,
                    // exceptedIds,
                    // acceptedIds,
                    // maxEvents,
                    // canSelectNone,
                    // modalTitle,
                    // showCountNumber
                  )
                }
              />

              {checkBlackList && (
                <>
                  <Button
                    name={'Черный список (' + blackList.length + ' чел.)'}
                    icon={faCancel}
                    onClick={() =>
                      modalsFunc.selectUsers(
                        usersAll.filter((user) => blackList.includes(user._id)),
                        {},
                        (selectedUsers) => {
                          const selectedUsersIds = selectedUsers.map(
                            (user) => user._id
                          )
                          setBlackList(selectedUsersIds)
                        },
                        [], //exceptedIds
                        undefined, //acceptedIds
                        undefined, // maxUsers
                        true, // canSelectNone
                        'Выбор черного списка', //  modalTitle
                        false // getFullUser
                      )
                    }
                  />
                  {blockedUsersCount > 0 && (
                    <div className="flex text-danger">
                      Отфильтровано: {getNounUsers(blockedUsersCount)}
                    </div>
                  )}
                </>
              )}
              <CheckBox
                label="Использовать черный список"
                checked={checkBlackList}
                onChange={() => setCheckBlackList((checked) => !checked)}
                noMargin
              />
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <div className="w-fit grid grid-cols-[30px_64px_64px_64px] grid-rows-[30px_30px_30px_30px_30px] items-stretch justify-center overflow-hidden border rounded-lg border-general">
                <div className="border-b border-r" />
                <div className="flex items-center justify-center border-b border-r gap-x-1">
                  <UserStatusIcon size="xs" status="novice" />
                </div>
                <div className="flex items-center justify-center border-b border-r gap-x-1">
                  <UserStatusIcon size="xs" status="member" />
                </div>
                <div className="flex items-center justify-center border-b">
                  <div className="w-5 h-5 min-w-5">
                    <SvgSigma className="fill-general" />
                  </div>
                </div>
                <div className="flex items-center justify-center border-b border-r">
                  <FontAwesomeIcon
                    icon={faMars}
                    className="w-6 h-6 text-blue-600"
                  />
                </div>
                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.mansNovice}
                </div>
                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.mansMember}
                </div>
                <div className="flex items-center justify-center text-center border-b bg-general/10">
                  {selectedUsersData.mans}
                </div>
                <div className="flex items-center justify-center border-b border-r">
                  <FontAwesomeIcon
                    icon={faVenus}
                    className="w-6 h-6 text-red-600"
                  />
                </div>
                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.womansNovice}
                </div>
                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.womansMember}
                </div>
                <div className="flex items-center justify-center text-center border-b bg-general/10">
                  {selectedUsersData.womans}
                </div>
                <div className="flex items-center justify-center border-b border-r">
                  <FontAwesomeIcon
                    icon={faGenderless}
                    className="w-6 h-6 text-gray-400"
                  />
                </div>

                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.unknownGenderNovice}
                </div>
                <div className="flex items-center justify-center text-center border-b border-r">
                  {selectedUsersData.unknownGenderMember}
                </div>
                <div className="flex items-center justify-center text-center border-b bg-general/10">
                  {selectedUsersData.unknownGender}
                </div>
                <div className="flex items-center justify-center border-r">
                  <div className="w-5 h-5 min-w-5">
                    <SvgSigma className="fill-general" />
                  </div>
                </div>
                <div className="flex items-center justify-center text-center border-r bg-general/10">
                  {selectedUsersData.novice}
                </div>
                <div className="flex items-center justify-center text-center border-r bg-general/10">
                  {selectedUsersData.member}
                </div>
                <div className="flex items-center justify-center font-bold text-center bg-general/20">
                  {selectedUsersData.total}
                </div>
              </div>
            </div>
          </div>
        </InputWrapper>
        {/* <Divider title="Название рассылки" light thin /> */}
        <Input
          label="Название рассылки"
          type="text"
          value={newsletterName}
          onChange={setNewsletterName}
          required
        />
        {/* <Divider title="Текст сообщения" light thin /> */}

        <div>
          <Component
            label="Текст сообщения"
            html={message}
            onChange={setMessage}
            // placeholder="Описание мероприятия..."
            required
            customButtons={customButtons}
          />
        </div>
        <div>
          <Button
            name="Вставить текст из буфера"
            icon={faPaste}
            onClick={async () => {
              await pasteFromClipboard(setMessage)
              toggleRerender()
            }}
          />
        </div>
        <InputWrapper
          label="Предпросмотр сообщения"
          wrapperClassName="flex-col gap-y-1"
        >
          <div className="flex flex-wrap items-center justify-center w-full pb-2 border-b border-gray-400 gap-x-2">
            <GenderToggleButtons
              value={{
                male: previewVariables.муж,
                famale: !previewVariables.муж,
              }}
              onChange={() =>
                setPreviewVariables((state) => ({ ...state, муж: !state.муж }))
              }
              hideNullGender
            />
            <StatusUserToggleButtons
              value={{
                novice: !previewVariables.клуб,
                member: previewVariables.клуб,
              }}
              onChange={() =>
                setPreviewVariables((state) => ({
                  ...state,
                  клуб: !state.клуб,
                }))
              }
              hideBanned
            />
            <RelationshipUserToggleButtons
              value={{
                havePartner: previewVariables.пара,
                noPartner: !previewVariables.пара,
              }}
              onChange={() =>
                setPreviewVariables((state) => ({
                  ...state,
                  пара: !state.пара,
                }))
              }
            />
          </div>
          {preview ? (
            <div
              className="w-full max-w-full overflow-hidden list-disc textarea ql"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(preview),
              }}
            />
          ) : (
            <div className="text-gray-400">[нет сообщения]</div>
          )}
        </InputWrapper>
        {/* <div>
          <Button
            disabled={!message || !filteredSelectedUsers?.length}
            name="Отправить сообщение"
            onClick={() => {
              modalsFunc.confirm({
                title: 'Отправка сообщений на Whatsapp пользователям',
                text: `Вы уверены, что хотите сообщение ${getNoun(filteredSelectedUsers?.length, 'пользователю', 'пользователям', 'пользователям')}?`,
                onConfirm: () => {
                  const prepearedText = DOMPurify.sanitize(
                    convertHtmlToText(message, 'whatsapp'),
                    {
                      ALLOWED_TAGS: [],
                      ALLOWED_ATTR: [],
                    }
                  )
                  sendMessage(prepearedText)
                },
              })
            }}
          />
        </div> */}
      </div>
    )
  }

  return {
    title: `Создание рассылки`,
    confirmButtonName: 'Созать рассылку',
    // bottomLeftComponent: <LikesToggle eventId={eventId} />,
    Children: NewsletterModal,
  }
}

export default newsletterFunc
