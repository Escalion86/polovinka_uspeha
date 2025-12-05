import FormWrapper from '@components/FormWrapper'
// import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import newsletterSelector from '@state/selectors/newsletterSelector'
import ListWrapper from '@layouts/lists/ListWrapper'
import { UserItemFromId } from '@components/ItemCards'
import modalsFuncAtom from '@state/modalsFuncAtom'
// import LoadingSpinner from '@components/LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import Tooltip from '@components/Tooltip'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import MessageStatusToggleButtons from '@components/IconToggleButtons/MessageStatusToggleButtons'
import ContentHeader from '@components/ContentHeader'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus'

// const CardButtonsComponent = ({ newsletter }) => (
//   <CardButtons item={newsletter} typeOfItem="newsletter" forForm />
// )

const normalizeStatus = (statusMessage, success, errorMessage) => {
  if (statusMessage) return statusMessage
  if (success === true) return 'sent'
  if (success === false) return errorMessage || 'error'
  return 'pending'
}

const WhatsAppStatus = ({
  statusMessage,
  success,
  errorMessage,
  used = true,
}) => {
  // const location = useAtomValue(locationAtom)
  // console.log('statusMessage :>> ', statusMessage)
  // const [messageStatus, setMessageStatus] = useState(statusMessage)
  // const user = useAtomValue(userSelector(userId))
  // const userPhone = phone || user?.whatsapp || user?.phone

  // useEffect(() => {
  //   const fetchMessageStatus = async () => {
  //     const resp = await postData(
  //       `/api/${location}/newsletters/byType/getMessage`,
  //       {
  //         phone: userPhone,
  //         messageId,
  //       }
  //     )
  //     setMessageStatus(resp?.statusMessage || resp?.message)
  //     if (resp?.statusMessage) {
  //       const put = await putData(
  //         `/api/${location}/newsletters/` + newsletterId,
  //         {
  //           phone: userPhone,
  //           userId,
  //           messageStatus: resp?.statusMessage,
  //         }
  //       )
  //     }
  //   }
  //   if (!messageStatus) fetchMessageStatus()
  // }, [statusMessage, user, phone, messageId])

  //   {
  //     "statusCode": 400,
  //     "timestamp": "2025-03-31T16:50:20.397375467Z",
  //     "path": "/waInstance1103192825/getMessage/6a7dbc4088534c4aa91c66ba5141583bf71472a915f24ab69e",
  //     "message": "Message not found by id BAE5F5720F0482B7"
  // }

  // if (
  //   messageStatus &&
  //   !['read', 'sent', 'delivered'].includes(messageStatus?.statusMessage)
  // ) {
  // console.log('messageStatus :>> ', messageStatus)
  // }

  if (!used)
    return (
      <div className="flex items-center justify-center w-8 h-full px-1 border-l border-gray-700">
        <Tooltip title="Whatsapp не выбран для этой рассылки">
          <FontAwesomeIcon className="w-5 h-5 text-gray-400" icon={faMinus} />
        </Tooltip>
      </div>
    )

  const normalizedStatus = normalizeStatus(statusMessage, success, errorMessage)

  return (
    <div className="flex items-center justify-center w-8 h-full px-1 border-l border-gray-700">
      {(!normalizedStatus || normalizedStatus === 'pending') && (
        <Tooltip title="Whatsapp: отправляется">
          <FontAwesomeIcon className="w-5 h-5 text-gray-600" icon={faClock} />
        </Tooltip>
      )}
      {normalizedStatus === 'read' && (
        <Tooltip title="Whatsapp: прочитано">
          <FontAwesomeIcon
            className="w-5 h-5 text-success"
            icon={faCheckDouble}
          />
        </Tooltip>
      )}
      {normalizedStatus === 'sent' && (
        <Tooltip title="Whatsapp: отправлено">
          <FontAwesomeIcon className="w-5 h-5 text-gray-600" icon={faCheck} />
        </Tooltip>
      )}
      {normalizedStatus === 'delivered' && (
        <Tooltip title="Whatsapp: доставлено">
          <FontAwesomeIcon
            className="w-5 h-5 text-gray-600"
            icon={faCheckDouble}
          />
        </Tooltip>
      )}
      {normalizedStatus &&
        !['read', 'sent', 'delivered', 'pending'].includes(
          normalizedStatus
        ) && (
          <Tooltip
            title={
              typeof normalizedStatus === 'string'
                ? `Whatsapp: ${normalizedStatus}`
                : 'Whatsapp: ошибка'
            }
          >
            <FontAwesomeIcon className="w-5 h-5 text-danger" icon={faTimes} />
          </Tooltip>
        )}
    </div>
  )
}

const TelegramStatus = ({
  statusMessage,
  success,
  errorMessage,
  used = true,
}) => {
  if (!used)
    return (
      <div className="flex items-center justify-center w-8 h-full px-1 border-l border-gray-700">
        <Tooltip title="Telegram не выбран для этой рассылки">
          <FontAwesomeIcon className="w-5 h-5 text-gray-400" icon={faMinus} />
        </Tooltip>
      </div>
    )

  const normalizedStatus = normalizeStatus(statusMessage, success, errorMessage)

  return (
    <div className="flex items-center justify-center w-8 h-full px-1 border-l border-gray-700">
      {(!normalizedStatus || normalizedStatus === 'pending') && (
        <Tooltip title="Telegram: отправляется">
          <FontAwesomeIcon className="w-5 h-5 text-gray-600" icon={faClock} />
        </Tooltip>
      )}
      {normalizedStatus === 'read' && (
        <Tooltip title="Telegram: прочитано">
          <FontAwesomeIcon
            className="w-5 h-5 text-success"
            icon={faCheckDouble}
          />
        </Tooltip>
      )}
      {normalizedStatus === 'sent' && (
        <Tooltip title="Telegram: отправлено">
          <FontAwesomeIcon className="w-5 h-5 text-gray-600" icon={faCheck} />
        </Tooltip>
      )}
      {normalizedStatus === 'delivered' && (
        <Tooltip title="Telegram: доставлено">
          <FontAwesomeIcon
            className="w-5 h-5 text-gray-600"
            icon={faCheckDouble}
          />
        </Tooltip>
      )}
      {normalizedStatus &&
        !['read', 'sent', 'delivered', 'pending'].includes(
          normalizedStatus
        ) && (
          <Tooltip
            title={
              typeof normalizedStatus === 'string'
                ? `Telegram: ${normalizedStatus}`
                : 'Telegram: ошибка'
            }
          >
            <FontAwesomeIcon className="w-5 h-5 text-danger" icon={faTimes} />
          </Tooltip>
        )}
    </div>
  )
}

const newsletterUsersViewFunc = (newsletterId) => {
  const NewsletterUsersModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
    setBottomLeftButtonProps,
    setTitle,
  }) => {
    // const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const itemsFunc = useAtomValue(itemsFuncAtom)
    const loading = useAtomValue(
      loadingAtom('newsletterStatusMessages' + newsletterId)
    )
    // const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
    // const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    // const isLoggedUserDev = loggedUserActiveRole?.dev
    // const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
    // const seeUserEvents = loggedUserActiveRole?.users?.seeUserEvents
    // const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts

    const newsletter = useAtomValue(newsletterSelector(newsletterId))
    const newslettersList = newsletter?.newsletters || []
    const sendType = newsletter?.sendType || 'whatsapp-only'

    const newsellersStatusCount = useMemo(
      () => ({
        read: newslettersList.filter(
          ({ whatsappStatus }) => whatsappStatus === 'read'
        ).length,
        delivered: newslettersList.filter(
          ({ whatsappStatus }) => whatsappStatus === 'delivered'
        ).length,
        sent: newslettersList.filter(
          ({ whatsappStatus }) => whatsappStatus === 'sent'
        ).length,
        other: newslettersList.filter(
          ({ whatsappStatus }) =>
            whatsappStatus &&
            !['read', 'delivered', 'sent', 'pending'].includes(whatsappStatus)
        ).length,
        pending: newslettersList.filter(
          ({ whatsappStatus }) =>
            whatsappStatus === 'pending' || !whatsappStatus
        ).length,
      }),
      [newslettersList]
    )

    const [filter, setFilter] = useState({
      messageStatus: {
        read: true,
        delivered: true,
        sent: true,
        other: true,
        pending: true,
      },
    })

    const filteredNewsletters = useMemo(
      () =>
        newslettersList.filter(({ whatsappStatus }) =>
          !whatsappStatus
            ? filter.messageStatus.pending
            : typeof filter.messageStatus[whatsappStatus] === 'boolean'
              ? filter.messageStatus[whatsappStatus]
              : filter.messageStatus.other
        ),
      [newslettersList, filter]
    )

    // const copyResult = useCopyToClipboard(
    //   newsletter.message,
    //   'Сообщение скопировано в буфер обмена'
    // )

    useEffect(() => {
      if (!newsletter) closeModal()
    }, [newsletter])

    useEffect(() => {
      if (setBottomLeftButtonProps)
        setBottomLeftButtonProps({
          name: 'Обновить статусы сообщений',
          onClick: () => itemsFunc.newsletter.refresh(newsletterId),
          loading,
          loadingText: 'Обновление статусов...',
        })
    }, [setBottomLeftButtonProps, loading])

    useEffect(() => {
      if (newsletter?.name)
        setTitle(`Получатели рассылки "${newsletter?.name}"`)
    }, [newsletter])

    if (!newsletter) return null

    const usersIds = filteredNewsletters.map(({ userId }) => userId)
    const usesWhatsapp = sendType !== 'telegram-only'
    const usesTelegram = sendType !== 'whatsapp-only'

    return (
      <FormWrapper className="flex flex-col h-full">
        <ContentHeader noBorder>
          <MessageStatusToggleButtons
            value={filter.messageStatus}
            onChange={(value) => setFilter({ messageStatus: value })}
            names={newsellersStatusCount}
          />
        </ContentHeader>
        <div
          style={{ height: usersIds.length * 43 + 2 }}
          className={`flex-1 tablet:flex-none border-b border-t border-gray-700 tablet:max-h-[calc(100vh-270px)]`}
        >
          <ListWrapper
            // className="h-full"
            itemCount={usersIds.length}
            itemSize={43}
          >
            {({ index, style }) => (
              <div style={style} className="flex border-b border-gray-700">
                <UserItemFromId
                  key={usersIds[index]}
                  userId={usersIds[index]}
                  // active={
                  //   !!selectedUsers.find(
                  //     (user) => user._id == sortedUsers[index]._id
                  //   )
                  // }
                  noBorder
                  onClick={() => modalsFunc.user.view(usersIds[index])}
                  showConsentIcon
                />
                <div className="flex">
                  <WhatsAppStatus
                    userId={usersIds[index]}
                    phone={filteredNewsletters[index].whatsappPhone}
                    messageId={filteredNewsletters[index].whatsappMessageId}
                    newsletterId={newsletterId}
                    statusMessage={filteredNewsletters[index].whatsappStatus}
                    success={filteredNewsletters[index].whatsappSuccess}
                    errorMessage={filteredNewsletters[index].whatsappError}
                    used={usesWhatsapp}
                  />
                  <TelegramStatus
                    statusMessage={filteredNewsletters[index].telegramStatus}
                    success={filteredNewsletters[index].telegramSuccess}
                    errorMessage={filteredNewsletters[index].telegramError}
                    used={usesTelegram}
                  />
                </div>
              </div>
            )}
          </ListWrapper>
        </div>
        {/* <div className="flex flex-col flex-1 mt-1"> */}
        {/* <div className="relative flex items-center mb-1 gap-x-2 min-h-6">
            {!setTopLeftComponent && (
              <div className="absolute right-0">
                <CardButtonsComponent newsletter={newsletter} />
              </div>
            )}
          </div> */}
        {/* {isLoggedUserDev && <TextLine label="ID">{newsletter?._id}</TextLine>}
          <TextLine label="Название">
            {newsletter.name || '[без названия]'}
          </TextLine>
          <TextLine label="Дата рассылки">
            {formatDateTime(newsletter?.createdAt)}
          </TextLine>
          <TextLine label="Количество сообщений">
            {getNounMessages(newsletter?.newsletters?.length)}
          </TextLine>
          {(newsletter?.message ||
            newsletter?.newsletters[0]?.whatsappMessage) && (
            <InputWrapper label="Текст сообщения">
              <div
                className="w-full max-w-full overflow-hidden list-disc textarea ql"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    newsletter?.message ||
                      newsletter?.newsletters[0]?.whatsappMessage
                  ),
                }}
              />
            </InputWrapper>
          )}
        </div>
        <SelectUserList
          usersId={newsletter?.newsletters.map(({ userId }) => userId)}
          readOnly
        /> */}

        {/* <SelectEventList
          eventsId={eventUsers.map((eventUser) => eventUser.eventId)}
          readOnly
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Получатели рассылки`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: NewsletterUsersModal,
  }
}

export default newsletterUsersViewFunc
