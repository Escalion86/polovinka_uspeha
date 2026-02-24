import UserCardButtons from '@components/cardButtons/UserCardButtons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import FormWrapper from '@components/FormWrapper'
import ImagesMarquee from '@components/ImagesMarquee'
import ModalSurface from '@components/ModalSurface'
import ModalSectionTitle from '@components/ModalSectionTitle'
import TextLine from '@components/TextLine'
import UserName from '@components/UserName'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import UserStatusIcon from '@components/UserStatusIcon'
import ValueItem from '@components/ValuePicker/ValueItem'
import ZodiacIcon from '@components/ZodiacIcon'
import { faGenderless } from '@fortawesome/free-solid-svg-icons/faGenderless'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import { GENDERS } from '@helpers/constants'
import formatDate from '@helpers/formatDate'
import modalsFuncAtom from '@state/modalsFuncAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import eventsUsersSignedUpWithEventStatusByUserIdCountSelector from '@state/selectors/eventsUsersSignedUpWithEventStatusByUserIdCountSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useMemo } from 'react'
import { useAtomValue } from 'jotai'

const CardButtonsComponent = ({ user }) => (
  <UserCardButtons item={user} forForm />
)

const userViewFunc = (userId, params = {}) => {
  const UserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
    const seeUserEvents = loggedUserActiveRole?.users?.seeUserEvents
    const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts

    const user = useAtomValue(userSelector(userId))
    const userGender = GENDERS.find((item) => item.value === user?.gender)
    const canShowBirthday = Boolean(
      user?.birthday &&
      (seeBirthday ||
        user?.security?.showBirthday === true ||
        user?.security?.showBirthday === 'full' ||
        user?.security?.showBirthday === 'noYear')
    )
    const canShowBirthdayYear = Boolean(
      seeBirthday ||
      user?.security?.showBirthday === 'full' ||
      user?.security?.showBirthday === true
    )
    const hasVisibleContacts = useMemo(() => {
      if (!user) return false

      const canSeeAllContacts = Boolean(params?.showContacts || seeAllContacts)
      const isMemberAndUserIsMember =
        user.status === 'member' && isLoggedUserMember

      if (!canSeeAllContacts) {
        if (!isMemberAndUserIsMember) return false
        if (
          !user.security?.showPhone &&
          !user.security?.showWhatsapp &&
          !user.security?.showTelegram &&
          !user.security?.showInstagram &&
          !user.security?.showVk &&
          !user.security?.showEmail
        ) {
          return false
        }
      }

      const canShowBySecurity = (securityField) =>
        canSeeAllContacts ||
        (isMemberAndUserIsMember && user.security?.[securityField])

      const phoneVisible = Boolean(user.phone && canShowBySecurity('showPhone'))
      const whatsappVisible = Boolean(
        (user.whatsapp && canShowBySecurity('showWhatsapp')) ||
        (!user.whatsapp && seeAllContacts && canShowBySecurity('showWhatsapp'))
      )
      const telegramVisible = Boolean(
        (user.telegram && canShowBySecurity('showTelegram')) ||
        (!user.telegram && seeAllContacts && canShowBySecurity('showTelegram'))
      )
      const instagramVisible = Boolean(
        user.instagram && canShowBySecurity('showInstagram')
      )
      const vkVisible = Boolean(user.vk && canShowBySecurity('showVk'))
      const emailVisible = Boolean(user.email && canShowBySecurity('showEmail'))

      return Boolean(
        phoneVisible ||
        whatsappVisible ||
        telegramVisible ||
        instagramVisible ||
        vkVisible ||
        emailVisible
      )
    }, [isLoggedUserMember, params?.showContacts, seeAllContacts, user])

    const eventsUsersSignedUpCount = useAtomValue(
      eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
    )

    useEffect(() => {
      if (!user) closeModal()
    }, [user])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <UserCardButtons item={user} forForm showDeleteButton={false} />
        ))
    }, [setTopLeftComponent])

    if (!user) return null

    return (
      <FormWrapper className="flex flex-col gap-3">
        <ModalSurface tone="media" noPadding>
          <ImagesMarquee
            images={user?.images}
            className="rounded-2xl border border-[#ead7de] shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
            imageClassName="brightness-[0.95]"
            heightClassName="h-56 phoneH:h-70"
          />
        </ModalSurface>

        <ModalSurface tone="accent">
          <div className="relative flex items-center mb-1 gap-x-2 min-h-6">
            <FontAwesomeIcon
              icon={userGender?.icon ?? faGenderless}
              className={
                userGender?.value === 'male'
                  ? 'w-6 h-6 min-w-6 min-h-6 text-blue-400'
                  : userGender?.value === 'famale'
                    ? 'w-6 h-6 min-w-6 min-h-6 text-general'
                    : 'w-6 h-6 min-w-6 min-h-6 text-gray-400'
              }
            />
            <div className="flex flex-col items-start tablet:flex-row tablet:items-center tablet:gap-2">
              <UserName
                user={user}
                className="text-[clamp(20px,3.5vw,28px)] font-bold text-[#4b0f1c]"
                leadingClass="leading-[24px]"
              />
              {canShowBirthday ? (
                <span className="inline-flex mt-1 tablet:mt-0 items-center gap-1 rounded-full border border-[rgba(107,31,42,0.2)] bg-white/80 px-2.5 py-1 text-xs font-semibold text-[#6b1f2a] whitespace-nowrap">
                  <span className="whitespace-nowrap">
                    {birthDateToAge(
                      user.birthday,
                      serverDate,
                      true,
                      true,
                      canShowBirthdayYear
                    )}
                  </span>
                  <span className="inline-flex shrink-0">
                    <ZodiacIcon date={user.birthday} />
                  </span>
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {isLoggedUserMember ? (
                <UserStatusIcon status={user?.status} />
              ) : null}
              {!setTopLeftComponent && <CardButtonsComponent user={user} />}
            </div>
          </div>
          {user.personalStatus && (
            <div className="pt-1 text-sm italic font-normal leading-[18px] text-general">
              {user.personalStatus}
            </div>
          )}
        </ModalSurface>

        {user.town ? (
          <ModalSurface>
            <TextLine label="Место проживания">{user.town}</TextLine>
          </ModalSurface>
        ) : null}

        <ModalSurface>
          <ModalSectionTitle>Семейное положение</ModalSectionTitle>
          <TextLine label="Отношения">
            <UserRelationshipIcon
              size="m"
              relationship={user.relationship}
              showName
            />
          </TextLine>
          <TextLine label="Дети">
            {user?.haveKids === true
              ? 'Есть'
              : user?.haveKids === false
                ? 'Нет'
                : 'Не указано'}
          </TextLine>
        </ModalSurface>

        {hasVisibleContacts ? (
          <ModalSurface>
            <ModalSectionTitle>Контакты</ModalSectionTitle>
            <ContactsIconsButtons
              user={user}
              withTitle
              grid
              forceShowAll={params?.showContacts || seeAllContacts}
              forceWhatsApp={seeAllContacts}
              forceTelegram={seeAllContacts}
            />
          </ModalSurface>
        ) : null}

        <ModalSurface>
          <ModalSectionTitle>Активность</ModalSectionTitle>
          <div className="flex flex-col tablet:items-end tablet:flex-row tablet:justify-between gap-y-2 gap-x-4">
            <div className="flex flex-col">
              <TextLine label="Дата регистрации">
                {formatDate(user.createdAt)}
              </TextLine>
              <TextLine label="Посетил мероприятий">
                {eventsUsersSignedUpCount.finished}
              </TextLine>
              <TextLine label="Записан на мероприятия">
                {eventsUsersSignedUpCount.signUp}
              </TextLine>
            </div>

            {(seeUserEvents || isLoggedUserMember) &&
              (eventsUsersSignedUpCount.finished > 0 ||
                eventsUsersSignedUpCount.signUp > 0) && (
                <ValueItem
                  name="Посмотреть мероприятия"
                  color="general"
                  icon={faCalendarAlt}
                  hoverable
                  onClick={() => modalsFunc.user.events(userId)}
                />
              )}
          </div>
        </ModalSurface>

        {/* <SelectEventList
          eventsId={eventUsers.map((eventUser) => eventUser.eventId)}
          readOnly
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Профиль пользователя`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserModal,
    // TopLeftComponent: () => {
    //   return (
    //   <CardButtons id={userId} typeOfItem="user" forForm direction="right" />
    // )},
  }
}

export default userViewFunc
