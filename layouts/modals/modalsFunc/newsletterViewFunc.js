// import CardButtons from '@components/CardButtons'
import FormWrapper from '@components/FormWrapper'
import TextLine from '@components/TextLine'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import newsletterSelector from '@state/selectors/newsletterSelector'
import formatDateTime from '@helpers/formatDateTime'
import { getNounMessages } from '@helpers/getNoun'
import InputWrapper from '@components/InputWrapper'
import Button from '@components/Button'
import modalsFuncAtom from '@state/modalsFuncAtom'
import DropdownButtonCopyTextFormats from '@components/DropdownButtons/DropdownButtonCopyTextFormats'
import DOMPurify from 'isomorphic-dompurify'
// import { SelectUserList } from '@components/SelectItemList'

// const CardButtonsComponent = ({ newsletter }) => (
//   <CardButtons item={newsletter} typeOfItem="newsletter" forForm />
// )

const newsletterViewFunc = (newsletterId) => {
  const NewsletterViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
    setBottomLeftButtonProps,
    setBottomLeftComponent,
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

    const sendTypeTitles = {
      both: 'Whatsapp и Telegram',
      'telegram-first': 'Сначала Telegram, если ошибка — Whatsapp',
      'whatsapp-only': 'Только Whatsapp',
      'telegram-only': 'Только Telegram',
    }

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
      setBottomLeftComponent(
        <DropdownButtonCopyTextFormats text={newsletter?.message} />
      )
    }, [newsletter])

    if (!newsletter) return null

    return (
      <FormWrapper className="flex flex-col">
        <div className="flex flex-col flex-1 mt-1">
          {/* <div className="relative flex items-center mb-1 gap-x-2 min-h-6">
            {!setTopLeftComponent && (
              <div className="absolute right-0">
                <CardButtonsComponent newsletter={newsletter} />
              </div>
            )}
          </div> */}
          {isLoggedUserDev && <TextLine label="ID">{newsletter?._id}</TextLine>}
          <TextLine label="Название">
            {newsletter.name || '[без названия]'}
          </TextLine>
          <TextLine label="Тип рассылки">
            {sendTypeTitles[newsletter?.sendType] || 'Не указан'}
          </TextLine>
          <TextLine label="Дата рассылки">
            {formatDateTime(newsletter?.createdAt)}
          </TextLine>
          <TextLine label="Количество сообщений">
            {getNounMessages(newsletter?.newsletters?.length)}
          </TextLine>
          <Button
            name="Посмотреть получателей"
            onClick={() => modalsFunc.newsletter.usersView(newsletter._id)}
          />
          {newsletter?.image && (
            <InputWrapper label="Картинка">
              <div className="flex justify-center">
                <img
                  src={newsletter.image}
                  alt="newsletter_image"
                  className="max-h-60 rounded-xl"
                />
              </div>
            </InputWrapper>
          )}
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
        {/* <SelectUserList
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
    title: `Рассылка`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: NewsletterViewModal,
    // TopLeftComponent: () => {
    //   return (
    //   <CardButtons id={userId} typeOfItem="user" forForm direction="right" />
    // )},
  }
}

export default newsletterViewFunc
