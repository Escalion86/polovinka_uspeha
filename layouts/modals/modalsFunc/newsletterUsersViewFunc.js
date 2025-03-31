import CardButtons from '@components/CardButtons'
import FormWrapper from '@components/FormWrapper'
import TextLine from '@components/TextLine'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useCallback, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import newsletterSelector from '@state/selectors/newsletterSelector'
import formatDateTime from '@helpers/formatDateTime'
import { getNounMessages } from '@helpers/getNoun'
import InputWrapper from '@components/InputWrapper'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import { SelectUserList } from '@components/SelectItemList'
import ListWrapper from '@layouts/lists/ListWrapper'
import { UserItemFromId } from '@components/ItemCards'
import modalsFuncAtom from '@state/modalsFuncAtom'
import locationAtom from '@state/atoms/locationAtom'
import userSelector from '@state/selectors/userSelector'
import { postData } from '@helpers/CRUD'
import LoadingContent from '@layouts/content/LoadingContent'
import LoadingSpinner from '@components/LoadingSpinner'

// const CardButtonsComponent = ({ newsletter }) => (
//   <CardButtons item={newsletter} typeOfItem="newsletter" forForm />
// )

const WhatsAppStatus = ({ userId, phone, messageId }) => {
  const location = useAtomValue(locationAtom)
  const [messageStatus, setMessageStatus] = useState(null)
  const user = useAtomValue(userSelector(userId))
  const userPhone = phone || user?.whatsapp || user?.phone

  console.log('messageStatus :>> ', messageStatus)

  useEffect(() => {
    const fetchMessageStatus = async () => {
      const resp = await postData(
        `/api/${location}/newsletters/byType/getMessage`,
        {
          phone: userPhone,
          messageId,
        }
      )
      setMessageStatus(resp)
    }
    fetchMessageStatus()
  }, [])

  return (
    <div className="flex items-center justify-center w-24 h-full border-l border-gray-700">
      {messageStatus ? (
        <div className="">
          {messageStatus.statusMessage === 'read' && (
            <div className="font-bold text-success">Прочитано</div>
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
    const isLoggedUserDev = loggedUserActiveRole?.dev
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
