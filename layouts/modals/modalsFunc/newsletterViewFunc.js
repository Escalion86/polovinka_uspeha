import CardButtons from '@components/CardButtons'
import FormWrapper from '@components/FormWrapper'
import TextLine from '@components/TextLine'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import newsletterSelector from '@state/selectors/newsletterSelector'
import formatDateTime from '@helpers/formatDateTime'
import { getNounMessages } from '@helpers/getNoun'

// const CardButtonsComponent = ({ newsletter }) => (
//   <CardButtons item={newsletter} typeOfItem="newsletter" forForm />
// )

const newsletterViewFunc = (newsletterId, params = {}) => {
  const NewsletterModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    // const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
    // const modalsFunc = useAtomValue(modalsFuncAtom)
    // const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const isLoggedUserDev = loggedUserActiveRole?.dev
    // const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
    // const seeUserEvents = loggedUserActiveRole?.users?.seeUserEvents
    // const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts

    const newsletter = useAtomValue(newsletterSelector(newsletterId))

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
          <TextLine label="Дата рассылки">
            {formatDateTime(newsletter?.createdAt)}
          </TextLine>
          <TextLine label="Количество сообщений">
            {getNounMessages(newsletter?.newsletters?.length)}
          </TextLine>
        </div>

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
    Children: NewsletterModal,
    // TopLeftComponent: () => {
    //   return (
    //   <CardButtons id={userId} typeOfItem="user" forForm direction="right" />
    // )},
  }
}

export default newsletterViewFunc
