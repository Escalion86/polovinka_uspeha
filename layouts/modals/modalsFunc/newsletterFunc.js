'use client'

import Button from '@components/Button'
import ComboBox from '@components/ComboBox'
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
// import convertHtmlToText from '@helpers/convertHtmlToText'
// import pasteFromClipboard from '@helpers/pasteFromClipboard'
import getNoun, { getNounUsers } from '@helpers/getNoun'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt'
// import Divider from '@components/Divider'
// import { faCancel } from '@fortawesome/free-solid-svg-icons/faCancel'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import useSnackbar from '@helpers/useSnackbar'
import usersAtomAsync from '@state/async/usersAtomAsync'
// import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import RadioBox from '@components/RadioBox'
import itemsFuncAtom from '@state/itemsFuncAtom'
import { faHandshake } from '@fortawesome/free-solid-svg-icons/faHandshake'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus'
import { faUserMinus } from '@fortawesome/free-solid-svg-icons/faUserMinus'
import extractVariables from '@helpers/extractVariables'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import newsletterSelector from '@state/selectors/newsletterSelector'
import formatEventNotificationText from '@helpers/formatEventNotificationText'
// import DropdownButton from '@components/DropdownButton'
// import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
// import { faHtml5 } from '@fortawesome/free-brands-svg-icons/faHtml5'
import DropdownButtonCopyTextFormats from '@components/DropdownButtons/DropdownButtonCopyTextFormats'
import DropdownButtonPasteTextFormats from '@components/DropdownButtons/DropdownButtonPasteTextFormats'
import DOMPurify from 'isomorphic-dompurify'
import InputImage from '@components/InputImage'
import dayjs from 'dayjs'
import {
  NEWSLETTER_SEND_MODES,
  NEWSLETTER_SEND_MODE_OPTIONS,
  NEWSLETTER_SENDING_STATUSES,
  NEWSLETTER_SENDING_STATUS_OPTIONS_EDITABLE,
  NEWSLETTER_TIME_OPTIONS,
} from '@helpers/constantsNewsletters'

// import TurndownService from 'turndown'

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

const getNearestHalfHourTime = () => {
  const now = dayjs()
  const minutes = now.minute()
  const remainder = minutes % 30
  const target = remainder === 0 ? now : now.add(30 - remainder, 'minute')
  return target.format('HH:mm')
}

const newsletterFunc = (
  newsletterId,
  { name, users, event, message, whatsappAuthorized = true } = {}
) => {
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
    setBottomLeftComponent,
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

    const whatsappActivated = siteSettings?.newsletter?.whatsappActivated
    const isWhatsappReady = whatsappActivated && whatsappAuthorized

    const blackList = siteSettings?.newsletter?.blackList || []

    const blacklistUsers = useMemo(
      () =>
        (usersAll || []).filter(
          (user) => user?._id && blackList.includes(user._id)
        ),
      [blackList, usersAll]
    )

    const availableUsersForBlacklist = useMemo(
      () =>
        (usersAll || []).filter(
          (user) => user?._id && !blackList.includes(user._id)
        ),
      [blackList, usersAll]
    )

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

    const initialSelectedUsers = useMemo(
      () =>
        newsletter?.newsletters
          ? newsletter.newsletters.map(({ userId }) =>
              usersAll.find((user) => user._id === userId)
            )
          : users || [],
      [newsletter?.newsletters, users, usersAll]
    )

    const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers)

    const defaultMessageState = useMemo(() => {
      if (newsletter?.message) return newsletter.message
      if (message) return message
      if (!event) return ''

      const onlyMembersSelected =
        initialSelectedUsers.length > 0 &&
        initialSelectedUsers.every((user) => user?.status === 'member')

      const notificationText = formatEventNotificationText(event, {
        location,
        userStatus: onlyMembersSelected ? 'member' : 'novice',
        withEventLink: true,
      })

      return notificationText.replaceAll('\n', '<br>')
    }, [event, initialSelectedUsers, location, message, newsletter?.message])
    const defaultImageState = useMemo(
      () => newsletter?.image || '',
      [newsletter?.image]
    )
    // const [blackList, setBlackList] = useState([])
    const [messageState, setMessageState] = useState(defaultMessageState)
    const [newsletterImage, setNewsletterImage] = useState(defaultImageState)
    const [newsletterSendType, setNewsletterSendType] = useState(
      isWhatsappReady ? newsletter?.sendType || 'both' : 'telegram-only'
    )
    const [sendMode, setSendMode] = useState(NEWSLETTER_SEND_MODES.IMMEDIATE)
    const [plannedSendDate, setPlannedSendDate] = useState(
      dayjs().format('YYYY-MM-DD')
    )
    const [plannedSendTime, setPlannedSendTime] = useState(
      getNearestHalfHourTime()
    )
    const [sendingStatus, setSendingStatus] = useState(
      NEWSLETTER_SENDING_STATUSES.WAITING
    )
    const [isSavingScheduled, setIsSavingScheduled] = useState(false)
    const [rerender, setRerender] = useState(false)

    const toggleRerender = () => setRerender((state) => !state)

    useEffect(() => {
      if (
        !isWhatsappReady &&
        ['both', 'telegram-first', 'whatsapp-only'].includes(newsletterSendType)
      ) {
        setNewsletterSendType('telegram-only')
      }
    }, [newsletterSendType, isWhatsappReady])

    useEffect(() => {
      if (newsletter?.sendType) setNewsletterSendType(newsletter.sendType)
    }, [newsletter?.sendType])

    useEffect(() => {
      setNewsletterImage(defaultImageState)
    }, [defaultImageState])

    const filteredSelectedUsers = useMemo(() => {
      if (!checkBlackList) return selectedUsers
      return selectedUsers.filter(
        (user) => user?._id && !blackList.includes(user?._id)
      )
    }, [selectedUsers, blackList, checkBlackList])

    const sendTypeOptions = useMemo(() => {
      const options = [
        {
          value: 'both',
          label: 'Whatsapp и Telegram',
          requiresWhatsapp: true,
        },
        {
          value: 'telegram-first',
          label: 'Сначала Telegram, если ошибка — Whatsapp',
          requiresWhatsapp: true,
        },
        {
          value: 'whatsapp-only',
          label: 'Только Whatsapp',
          requiresWhatsapp: true,
        },
        {
          value: 'telegram-only',
          label: 'Только Telegram',
          requiresWhatsapp: false,
        },
      ]

      if (isWhatsappReady) return options

      return options.filter(({ requiresWhatsapp }) => !requiresWhatsapp)
    }, [isWhatsappReady])

    const sendTypeTitles = useMemo(
      () =>
        sendTypeOptions.reduce((acc, option) => {
          acc[option.value] = option.label
          return acc
        }, {}),
      [sendTypeOptions]
    )

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
            success('Черный список обновлен')
          },
          () => {
            error('Не удалось обновить черный список')
          },
          false,
          loggedUserActive?._id
        )
      },
      [location, loggedUserActive]
    )

    const openEditBlacklistSelector = useCallback(
      (usersSource, title, onSelect) => {
        if (!usersSource?.length) return false
        modalsFunc.selectUsers(
          usersSource,
          {},
          onSelect,
          [],
          undefined,
          undefined,
          true,
          title,
          false
        )
        return true
      },
      [modalsFunc]
    )

    const openBlacklistSelector = useCallback(
      (usersSource, title, onSelect) => {
        if (!usersSource?.length) return false
        modalsFunc.selectUsers(
          undefined,
          {},
          onSelect,
          [],
          usersSource.map(({ _id }) => _id),
          undefined,
          true,
          title,
          false
        )
        return true
      },
      [modalsFunc]
    )

    const handleBlacklistEdit = useCallback(() => {
      if (
        !openEditBlacklistSelector(
          blacklistUsers,
          'Редактирование черного списка рассылки',
          (selectedUsers) => {
            if (!selectedUsers) return
            const ids = selectedUsers.map((user) => user?._id).filter(Boolean)
            setBlackList(ids)
          }
        )
      ) {
        info('Черный список обновлен')
      }
    }, [blacklistUsers, info, openBlacklistSelector, setBlackList])

    const handleBlacklistAdd = useCallback(() => {
      if (
        !openBlacklistSelector(
          availableUsersForBlacklist,
          'Добавление в черный список рассылки',
          (selectedUsers) => {
            if (!selectedUsers?.length) return
            const idsToAdd = selectedUsers
              .map((user) => user?._id)
              .filter(Boolean)
            if (!idsToAdd.length) return
            const updated = Array.from(new Set([...blackList, ...idsToAdd]))
            setBlackList(updated)
          }
        )
      ) {
        info('Черный список обновлен')
      }
    }, [
      availableUsersForBlacklist,
      blackList,
      info,
      openBlacklistSelector,
      setBlackList,
    ])

    const handleBlacklistRemove = useCallback(() => {
      if (
        !openBlacklistSelector(
          blacklistUsers,
          'Удаление из черного списка рассылки',
          (selectedUsers) => {
            if (!selectedUsers?.length) return
            const idsToRemove = new Set(
              selectedUsers.map((user) => user?._id).filter(Boolean)
            )
            if (!idsToRemove.size) return
            const updated = blackList.filter((id) => !idsToRemove.has(id))
            setBlackList(updated)
          }
        )
      ) {
        info('Черный список обновлен')
      }
    }, [blackList, blacklistUsers, info, openBlacklistSelector, setBlackList])

    const prepearedText = useMemo(() => {
      // var turndownService = new TurndownService()
      // return turndownService.turndown(
      //   messageState
      //   // .replaceAll('<p><br></p>', '<br>')
      //   // .replaceAll('<blockquote>', '<br><blockquote>')
      //   // .replaceAll('<li>', '<br>\u{2764} <li>')
      //   // .replaceAll('<p>', '<br><p>')
      //   // .replaceAll('<p><br></p>', '\n')
      //   // .replaceAll('<br>', '\n')
      // )
      return DOMPurify.sanitize(
        messageState
          // .replaceAll('-', '—')
          .replaceAll('*', '⚹')
          .replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, (olBlock) => {
            let counter = 1
            return olBlock
              .replace(
                /<li\b[^>]*data-list="ordered"[^>]*>[\s\S]*?<\/li>/gi,
                (liTag) => {
                  // Извлекаем текст, удаляя все внутренние HTML-теги
                  const text = liTag
                    // .replace(/<span\b[^>]*>[\s\S]*?<\/span>/gi, '') // Удаляем элемент span
                    // .replace(/<[^>]+>/g, '') // Удаляем оставшиеся HTML-теги
                    .trim()

                  return `${counter++}. ${text}\n`
                }
              )
              .replace(/<\/?ol[^>]*>/g, '') // Удаляем оставшиеся теги списка
              .trim()
          })
          .replace(/<li data-list="bullet">/gi, '❤️ ')
          .replace(/<\/li>/gi, '<br>')
          .replace(
            /(\s*)<(b|strong)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
            (_, before, tag, wsOpen, content, wsClose, after) => {
              return `${before + wsOpen || ' '}<${tag}>${content.trim()}</${tag}>${wsClose + after || ' '}`
            }
          )
          .replace(
            /(\s*)<(i|em)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
            (_, before, tag, wsOpen, content, wsClose, after) => {
              return `${before + wsOpen || ' '}<${tag}>${content.trim()}</${tag}>${wsClose + after || ' '}`
            }
          )
          .replace(
            /(\s*)<(s|del|strike)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
            (_, before, tag, wsOpen, content, wsClose, after) => {
              return `${before + wsOpen || ' '}<${tag}>${content.trim()}</${tag}>${wsClose + after || ' '}`
            }
          )
          .trim(),
        {
          ALLOWED_TAGS: [
            'b',
            'i',
            's',
            'strong',
            'br',
            'p',
            'em',
            'strike',
            'del',
          ],
          ALLOWED_ATTR: [],
        }
      )
        .replace(/^(<br[^>]*>)+/gi, '') // Удалить теги br в начале
        .replace(/(<br[^>]*>)+$/gi, '') // Удалить теги br в конце
    }, [messageState])

    // function htmlToWhatsappMD(htmlText) {
    //   console.log('htmlText :>> ', htmlText)
    //   let markdown = (htmlText || '')
    //     // 0. Замена символов влияющих на форматирование
    //     .replaceAll('-', '—')
    //     .replaceAll('*', '⚹')
    //     // 1. Замена HTML-сущностей
    //     .replace(/&lt;/g, '<')
    //     .replace(/&gt;/g, '>')
    //     .replace(/&amp;/g, '&')
    //     .replace(/&quot;/g, '"')

    //     // 2. Обработка переносов строк
    //     .replace(/<\/p><p><br><\/p><p><br><\/p><p>/gi, '\n\n\n')
    //     .replace(/<\/p><p><br><\/p><p>/gi, '\n\n')
    //     .replace(/<p><br><\/p>/gi, '\n')
    //     .replace(/<br><p>/gi, '\n')

    //     .replace(/<br\s*\/?>/gi, '\n') // <br> → перенос
    //     .replace(/<\/p><p>/gi, '\n') // </p> → перенос
    //     .replace(/<\/p>/gi, '\n') // </p> → перенос
    //     .replace(/<p>/gi, '\n') // <p> → начало нового абзаца

    //     // Обработка пробелов вокруг открывающих тегов
    //     .replace(
    //       /(\s*)<(b|strong)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
    //       (_, before, tag, wsOpen, content, wsClose, after) => {
    //         return `${before + wsOpen || ' '}*${content.trim()}*${wsClose + after || ' '}`
    //       }
    //     )
    //     .replace(
    //       /(\s*)<(i|em)>(\s*)(.*?)(\s*)<\/\3>(\s*)/gi,
    //       (_, before, tag, wsOpen, content, wsClose, after) => {
    //         return `${before + wsOpen || ' '}_${content.trim()}_${wsClose + after || ' '}`
    //       }
    //     )
    //     .replace(
    //       /(\s*)<(s|del|strike)>(\s*)(.*?)(\s*)<\/\4>(\s*)/gi,
    //       (_, before, tag, wsOpen, content, wsClose, after) => {
    //         return `${before + wsOpen || ' '}~${content.trim()}~${wsClose + after || ' '}`
    //       }
    //     )

    //     // 3. Обработка форматирования
    //     // .replace(/\s<(b|strong)>(.*?)<\/\1>/gi, '*$2* ')
    //     // .replace(/<(b|strong)>(.*?)<\/\1>/gi, '*$2*')
    //     // .replace(/<(i|em)>(.*?)<\/\1>/gi, '_$2_')
    //     // .replace(/<(s|del)>(.*?)<\/\1>/gi, '~$2~')

    //     // 4. Удаление HTML-тегов (сохраняем пробелы)
    //     .replace(/<[^>]+>/g, ' ')

    //     // 5. Чистка пробелов (БЕЗ УДАЛЕНИЯ ПЕРЕНОСОВ)
    //     // console.log('1', JSON.stringify({ markdown }))
    //     // markdown = markdown
    //     // .replace(/[ \t]+/g, ' ') // Схлопываем пробелы и табы
    //     .replace(/ +(\n)/g, '$1') // Убираем пробелы перед переносами
    //     .replace(/(\n) +/g, '$1') // Убираем пробелы после переносов
    //     // .replace(/(\*|_|~) /g, '$1') // Пробелы после форматирования
    //     // .replace(/ (\*|_|~)/g, '$1') // Пробелы перед форматированием

    //     // 6. Нормализация переносов
    //     .replace(/\n{4,}/g, '\n\n\n') // Максимум 3 переноса подряд
    //     .trim()
    //   return markdown
    // }

    // const inputText = `<p>Добрый день.  🙌</p><p>Меня зовут Надежда - я руководитель центра знакомств "Половинка успеха"❤️.</p><p><br></p><p>Напоминаю, что вы записаны<strong>26 марта (среда) с 19.00 до 22.30  на</strong>формат "Покер для всех". </p><p><br></p><p>‼️<strong>Подскажите у вас всё в силе, планируете придти на игру?😊</strong>🙌</p>`
    // // console.log('messageState :>> ', messageState)
    // console.log(
    //   'test :>> ',
    //   JSON.stringify({ test: htmlToWhatsappMD(inputText) })
    // )

    const preview = useMemo(
      () => replaceVariableInTextTemplate(prepearedText, previewVariables),
      [prepearedText, previewVariables]
    )

    const buildUsersMessagesPayload = useCallback(() => {
      const variables = extractVariables(prepearedText)
      const variablesObject = {}
      for (let i = 0; i < variables.length; i++) {
        const varName = variables[i]
        variablesObject[varName] = true
      }

      const usersMessages = filteredSelectedUsers.map((user) => ({
        userId: user._id,
        whatsappPhone: user.whatsapp || user.phone,
        telegramId: user.notifications?.telegram?.id,
        variables: {
          ...(variablesObject.муж ? { муж: user.gender === 'male' } : {}),
          ...(variablesObject.клуб ? { клуб: user.status === 'member' } : {}),
          ...(variablesObject.пара ? { пара: !!user.relationship } : {}),
        },
      }))

      return usersMessages
    }, [filteredSelectedUsers, prepearedText])

    const sendMessage = useCallback(
      async (name, message) => {
        const usersMessages = buildUsersMessagesPayload()
        postData(
          `/api/${location}/newsletters/byType/sendMessage`,
          {
            name,
            sendType: newsletterSendType,
            usersMessages,
            image: newsletterImage,
            message,
          },
          (data) => {
            setNewsletter(data)
          },
          (data) => {
            error('Не получилось отправить рассылку! Детали ошибки: ' + data)
          }
        )

        closeModal()
        info('Рассылка отправлена и далее сообщения попадут в очередь отправки')
      },
      [
        buildUsersMessagesPayload,
        closeModal,
        error,
        info,
        location,
        newsletterImage,
        newsletterSendType,
        setNewsletter,
      ]
    )

    const handleSaveScheduledNewsletter = useCallback(async () => {
      if (!plannedSendDate) {
        error('Укажите дату отправки рассылки')
        return
      }
      if (!plannedSendTime) {
        error('Укажите время отправки рассылки')
        return
      }

      try {
        setIsSavingScheduled(true)
        const usersMessages = buildUsersMessagesPayload()
        const payload = {
          name: newsletterName?.trim() || '',
          newsletters: usersMessages,
          message: messageState,
          image: newsletterImage,
          sendType: newsletterSendType,
          sendMode,
          sendingStatus,
          plannedSendDate,
          plannedSendTime,
        }

        const created = await postData(
          `/api/${location}/newsletters`,
          payload,
          (data) => {
            setNewsletter(data)
          },
          null,
          false,
          loggedUserActive?._id
        )

        if (!created) {
          throw new Error('create-newsletter')
        }

        success('Рассылка сохранена')
        closeModal()
      } catch (scheduleError) {
        console.log('handleSaveScheduledNewsletter error', scheduleError)
        error('Не получилось сохранить рассылку')
      } finally {
        setIsSavingScheduled(false)
      }
    }, [
      buildUsersMessagesPayload,
      closeModal,
      error,
      location,
      loggedUserActive?._id,
      messageState,
      newsletterImage,
      newsletterName,
      newsletterSendType,
      plannedSendDate,
      plannedSendTime,
      sendMode,
      sendingStatus,
      setNewsletter,
      success,
    ])
    const Component = useCallback(
      (props) => <EditableTextarea {...props} />,
      [rerender]
    )

    // const customButtons = undefined

    const customButtons = useMemo(() => {
      return {
        handlers: {
          '{клуб}': function (value) {
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
          '{муж}': function (value) {
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
          '{пара}': function (value) {
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
        container: [['{клуб}'], ['{муж}'], ['{пара}']],
      }
    }, [])

    const blockedUsersCount =
      selectedUsers.length - filteredSelectedUsers.length

    useEffect(() => {
      if (!setDisableConfirm) return
      setDisableConfirm(
        sendMode === NEWSLETTER_SEND_MODES.SCHEDULED && isSavingScheduled
      )
    }, [isSavingScheduled, sendMode, setDisableConfirm])

    useEffect(() => {
      const hasAccess = !!loggedUserActiveRole?.newsletters?.add
      const hasBaseData =
        hasAccess &&
        newsletterName &&
        messageState &&
        filteredSelectedUsers?.length

      if (!hasBaseData) {
        setOnConfirmFunc()
        return
      }

      if (sendMode === NEWSLETTER_SEND_MODES.SCHEDULED) {
        const canScheduleSave =
          plannedSendDate &&
          plannedSendTime &&
          sendingStatus &&
          !isSavingScheduled

        if (!canScheduleSave) {
          setOnConfirmFunc()
          return
        }

        setOnConfirmFunc(() => handleSaveScheduledNewsletter())
        return
      }

      const isWhatsappRequired = newsletterSendType !== 'telegram-only'
      if (isWhatsappRequired && !isWhatsappReady) {
        setOnConfirmFunc()
        return
      }

      setOnConfirmFunc(() =>
        modalsFunc.confirm({
          title: 'Отправить сообщения пользователям',
          text: `Вы уверены, что хотите отправить сообщения ${getNoun(
            filteredSelectedUsers?.length,
            'пользователю',
            'пользователям',
            'пользователям'
          )} (${sendTypeTitles[newsletterSendType]})?`,
          onConfirm: () => {
            sendMessage(newsletterName, messageState)
          },
        })
      )
    }, [
      filteredSelectedUsers?.length,
      handleSaveScheduledNewsletter,
      isSavingScheduled,
      isWhatsappReady,
      loggedUserActiveRole?.newsletters?.add,
      messageState,
      modalsFunc,
      newsletterName,
      newsletterSendType,
      plannedSendDate,
      plannedSendTime,
      sendMessage,
      sendMode,
      sendTypeTitles,
      sendingStatus,
    ])
    if (!loggedUserActiveRole?.newsletters?.add)
      return <div>Рассылка недоступна</div>

    useEffect(() => {
      // setBottomLeftButtonProps({
      //   name: 'Скопировать сообщение (html) в буфер',
      //   classBgColor: 'bg-general',
      //   icon: faCopy,
      //   onClick: () => copyResult(),
      // })
      setBottomLeftComponent(
        <DropdownButtonCopyTextFormats text={messageState} />
      )
    }, [messageState])

    return (
      <div className="flex flex-col px-1 py-1 overflow-y-auto gap-y-1">
        {/* <Divider title="Список пользователей" light thin /> */}
        <InputWrapper label="Список пользователей">
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            <div className="flex flex-col gap-y-1">
              <Button
                name="Редактировать список пользователей"
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
                name="Выбрать данные из мероприятия"
                icon={faCalendarAlt}
                onClick={() =>
                  modalsFunc.selectEvents(
                    [],
                    null,
                    async (data) => {
                      const eventId = data[0]
                      modalsFunc.selectUsersByStatusesFromEvent(
                        eventId,
                        (users, selectedEvent, withEventText) => {
                          if (users !== undefined) setSelectedUsers(users)
                          if (withEventText && selectedEvent) {
                            const onlyMembersSelected =
                              users?.length > 0 &&
                              users.every((user) => user?.status === 'member')

                            const notificationText =
                              formatEventNotificationText(selectedEvent, {
                                location,
                                userStatus: onlyMembersSelected
                                  ? 'member'
                                  : 'novice',
                                withEventLink: true,
                              })

                            setMessageState(
                              notificationText.replaceAll('\n', '<br>')
                            )
                            toggleRerender()
                          }
                        }
                      )
                      // setSelectedUsers(users)
                    },
                    [],
                    null,
                    1,
                    false,
                    'Выбрать данные из мероприятия'
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
                <InputWrapper
                  label={`Чёрный список (${getNounUsers(blackList.length)})`}
                  wrapperClassName="flex-col gap-y-2"
                >
                  <div className="flex flex-wrap gap-1">
                    <Button
                      name="Редактировать"
                      icon={faPencil}
                      onClick={handleBlacklistEdit}
                      disabled={!blacklistUsers.length}
                    />
                    <Button
                      name="Добавить"
                      icon={faUserPlus}
                      onClick={handleBlacklistAdd}
                      disabled={!availableUsersForBlacklist.length}
                    />
                    <Button
                      name="Удалить"
                      icon={faUserMinus}
                      onClick={handleBlacklistRemove}
                      disabled={!blacklistUsers.length}
                    />
                  </div>
                  {checkBlackList && blockedUsersCount > 0 && (
                    <div className="flex text-danger">
                      Скрыто: {getNounUsers(blockedUsersCount)}
                    </div>
                  )}
                </InputWrapper>
              )}
              <CheckBox
                label="Учитывать черный список"
                checked={checkBlackList}
                onChange={() => setCheckBlackList((checked) => !checked)}
                noMargin
              />
            </div>

            <div className="flex flex-wrap items-center justify-center flex-1 gap-1">
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
        <InputWrapper label="Тип рассылки" wrapperClassName="flex-col gap-y-1">
          <div className="flex flex-col gap-y-1">
            {sendTypeOptions.map((option) => {
              const disabled = option.requiresWhatsapp && !isWhatsappReady
              return (
                <RadioBox
                  key={option.value}
                  label={option.label}
                  checked={newsletterSendType === option.value}
                  onChange={() => {
                    if (disabled) return
                    setNewsletterSendType(option.value)
                  }}
                  disabled={disabled}
                  noMargin
                />
              )
            })}
            {!isWhatsappReady && (
              <div className="text-sm text-gray-500">
                Отправка в Whatsapp сейчас недоступна.
              </div>
            )}
          </div>
        </InputWrapper>
        <InputWrapper
          label="Когда отправлять"
          wrapperClassName="flex-col gap-y-1"
        >
          <div className="flex flex-col gap-y-1">
            {NEWSLETTER_SEND_MODE_OPTIONS.map((option) => (
              <RadioBox
                key={option.value}
                label={option.name}
                checked={sendMode === option.value}
                onChange={() => setSendMode(option.value)}
                noMargin
              />
            ))}
          </div>
        </InputWrapper>
        {sendMode === NEWSLETTER_SEND_MODES.SCHEDULED && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Дата отправки"
                type="date"
                value={plannedSendDate}
                onChange={setPlannedSendDate}
                required
              />
              <ComboBox
                label="Время отправки"
                value={plannedSendTime}
                onChange={(value) => setPlannedSendTime(value || '')}
                items={NEWSLETTER_TIME_OPTIONS}
                placeholder="Выберите время"
                activePlaceholder
                required
              />
            </div>
            <ComboBox
              label="Статус рассылки"
              value={sendingStatus}
              onChange={(value) =>
                setSendingStatus(value || NEWSLETTER_SENDING_STATUSES.WAITING)
              }
              items={NEWSLETTER_SENDING_STATUS_OPTIONS_EDITABLE}
              placeholder="Выберите статус"
              activePlaceholder
              required
            />
          </>
        )}
        <InputImage
          label="Картинка для рассылки"
          directory="newsletters"
          image={newsletterImage}
          onChange={(image) => setNewsletterImage(image || '')}
          paddingY="small"
        />
        {/* <Divider title="Текст сообщения" light thin /> */}

        <div>
          <Component
            label="Текст сообщения"
            html={messageState}
            onChange={setMessageState}
            // placeholder="Описание мероприятия..."
            required
            customButtons={customButtons}
          />
        </div>
        <DropdownButtonPasteTextFormats
          onSelect={(text) => {
            setMessageState(text)
            toggleRerender()
          }}
        />
        {/* <DropdownButton
          name="Вставить текст"
          icon={faPaste}
          items={[
            {
              name: 'Html из буфера',
              onClick: async () => {
                await pasteFromClipboard(setMessageState)
                toggleRerender()
              },
              icon: faHtml5,
            },
            {
              name: 'Скопированный из Whatsapp',
              onClick: async () => {
                await pasteFromClipboard((text) => {
                  const prepearedText = convertWhatsAppToHTML(text)
                  setMessageState(prepearedText)
                })
                toggleRerender()
              },
              icon: faWhatsapp,
            },
          ]}
        /> */}
        {/* <div>
          <Button
            name="Вставить html из буфера"
            icon={faPaste}
            onClick={async () => {
              await pasteFromClipboard(setMessageState)
              toggleRerender()
            }}
          />
        </div>
        <div>
          <Button
            name="Вставить текст скопированный из whatsapp"
            icon={faPaste}
            onClick={async () => {
              await pasteFromClipboard((text) => {
                const prepearedText = convertWhatsAppToHTML(text)
                setMessageState(prepearedText)
              })
              toggleRerender()
            }}
          />
        </div> */}
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
          {newsletterImage && (
            <div className="flex justify-center w-full">
              <img
                src={newsletterImage}
                alt="newsletter_image_preview"
                className="object-cover max-h-60 rounded-xl"
              />
            </div>
          )}
          {preview ? (
            // <div className="relative w-full max-w-full pl-3">
            //   <div className="absolute -rotate-90 -left-2">Предпросмотр</div>
            <div
              className="w-full max-w-full overflow-hidden list-disc textarea ql"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(preview),
              }}
            />
          ) : (
            // </div>
            <div className="text-gray-400">[нет сообщения]</div>
          )}
        </InputWrapper>
        {/* <div>
          <Button
            disabled={!messageState || !filteredSelectedUsers?.length}
            name="Отправить сообщение"
            onClick={() => {
              modalsFunc.confirm({
                title: 'Отправка сообщений на Whatsapp пользователям',
                text: `Вы уверены, что хотите сообщение ${getNoun(filteredSelectedUsers?.length, 'пользователю', 'пользователям', 'пользователям')}?`,
                onConfirm: () => {
                  const prepearedText = DOMPurify.sanitize(
                    convertHtmlToText(messageState, 'whatsapp'),
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
    confirmButtonName: 'Создать рассылку',
    // bottomLeftComponent: <LikesToggle eventId={eventId} />,
    Children: NewsletterModal,
  }
}

export default newsletterFunc
