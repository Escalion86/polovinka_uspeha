import FormWrapper from '@components/FormWrapper'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import newsletterSelector from '@state/selectors/newsletterSelector'
import ListWrapper from '@layouts/lists/ListWrapper'
import { UserItemFromId } from '@components/ItemCards'
import modalsFuncAtom from '@state/modalsFuncAtom'
import LoadingSpinner from '@components/LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import Tooltip from '@components/Tooltip'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'

// const CardButtonsComponent = ({ newsletter }) => (
//   <CardButtons item={newsletter} typeOfItem="newsletter" forForm />
// )

const WhatsAppStatus = ({
  statusMessage,
  userId,
  phone,
  messageId,
  newsletterId,
}) => {
  // const location = useAtomValue(locationAtom)
  // console.log('statusMessage :>> ', statusMessage)
  const [messageStatus, setMessageStatus] = useState(statusMessage)
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

  return (
    <div className="flex items-center justify-center w-8 h-full px-1 border-l border-gray-700">
      {messageStatus ? (
        <div className="">
          {messageStatus === 'pending' && (
            // <div className="font-bold text-success">Прочитано</div>
            <Tooltip title="Отправляется">
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faClock}
              />
            </Tooltip>
          )}
          {messageStatus === 'read' && (
            // <div className="font-bold text-success">Прочитано</div>
            <Tooltip title="Прочитано">
              <FontAwesomeIcon
                className="w-5 h-5 text-success"
                icon={faCheckDouble}
              />
            </Tooltip>
          )}
          {messageStatus === 'sent' && (
            <Tooltip title="Отправлено">
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faCheck}
              />
            </Tooltip>
          )}
          {messageStatus === 'delivered' && (
            <Tooltip title="Доставлено">
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faCheckDouble}
              />
            </Tooltip>
          )}
          {/* {!['read', 'sent', 'delivered'].includes(messageStatus) && (
            <div className="text-danger">{messageStatus}</div>
          )} */}
          {!['read', 'sent', 'delivered', 'pending'].includes(
            messageStatus
          ) && (
            <Tooltip title={messageStatus}>
              <FontAwesomeIcon className="w-5 h-5 text-danger" icon={faTimes} />
            </Tooltip>
          )}
        </div>
      ) : (
        <LoadingSpinner size="xxs" />
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
    // const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    // const isLoggedUserDev = loggedUserActiveRole?.dev
    // const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
    // const seeUserEvents = loggedUserActiveRole?.users?.seeUserEvents
    // const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts

    const newsletter = useAtomValue(newsletterSelector(newsletterId))

    // const copyResult = useCopyToClipboard(
    //   newsletter.message,
    //   'Сообщение скопировано в буфер обмена'
    // )

    useEffect(() => {
      if (!newsletter) closeModal()
    }, [newsletter])

    // useEffect(() => {
    //   if (setTopLeftComponent)
    //     setTopLeftComponent(() => (
    //       <CardButtons
    //         item={user}
    //         typeOfItem="user"
    //         forForm
    //         showDeleteButton={false}
    //       />
    //     ))
    // }, [setTopLeftComponent])

    useEffect(() => {
      setTitle(`Пользователи рассылки "${newsletter?.name}"`)
    }, [newsletter])

    if (!newsletter) return null

    const usersIds = newsletter.newsletters.map(({ userId }) => userId)

    return (
      <FormWrapper className="flex flex-col">
        <div
          style={{ height: usersIds.length * 42 + 2 }}
          className={`flex-1 tablet:flex-none border-gray-700 border-t tablet:max-h-[calc(100vh-270px)]`}
        >
          <ListWrapper itemCount={usersIds.length} itemSize={42}>
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
                />
                <WhatsAppStatus
                  userId={usersIds[index]}
                  phone={newsletter.newsletters[index].whatsappPhone}
                  messageId={newsletter.newsletters[index].whatsappMessageId}
                  newsletterId={newsletterId}
                  statusMessage={newsletter.newsletters[index].whatsappStatus}
                />
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
    title: `Пользователи рассылки`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: NewsletterUsersModal,
    // TopLeftComponent: () => {
    //   return (
    //   <CardButtons id={userId} typeOfItem="user" forForm direction="right" />
    // )},
  }
}

export default newsletterUsersViewFunc
