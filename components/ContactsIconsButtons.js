import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { faViber } from '@fortawesome/free-brands-svg-icons/faViber'
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons/faTelegramPlane'
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faVk } from '@fortawesome/free-brands-svg-icons/faVk'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faSms } from '@fortawesome/free-solid-svg-icons/faSms'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'

const ContactIconBtn = ({ url, icon, size = 'lg', className = null }) => (
  <FontAwesomeIcon
    className={cn(
      'h-6 cursor-pointer hover:text-toxic duration-300 hover:scale-110',
      className
    )}
    icon={icon}
    onClick={(event) => {
      event.stopPropagation()
      window.open(url)
    }}
    size={size}
  />
)

const ContactIconBtnWithTitle = ({
  url,
  icon,
  size = 'lg',
  className = null,
  title,
}) => (
  <div
    className="flex items-center cursor-pointer gap-x-2 group"
    onClick={(event) => {
      event.stopPropagation()
      window.open(url)
    }}
  >
    <div className="flex items-center justify-center w-6">
      <FontAwesomeIcon
        className={cn(
          'h-6 group-hover:text-toxic duration-300 group-hover:scale-115',
          className
        )}
        icon={icon}
        size={size}
      />
    </div>
    <span className="group-hover:text-toxic">{title}</span>
  </div>
)

const ContactsIconsButtons = ({
  user,
  withTitle,
  grid,
  className,
  message,
  smsViaPhone,
  forceWhatsApp,
  forceShowAll,
  forceTelegram,
}) => {
  const Btn = withTitle ? ContactIconBtnWithTitle : ContactIconBtn
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  if (!user) return null

  const canSeeAllContacts =
    forceShowAll || loggedUserActiveRole?.users?.seeAllContacts

  const isMemberAndUserIsMember = user.status === 'member' && isLoggedUserMember
  if (!canSeeAllContacts) {
    if (!isMemberAndUserIsMember) return null
    if (
      !user.security?.showPhone &&
      !user.security?.showWhatsapp &&
      !user.security?.showViber &&
      !user.security?.showTelegram &&
      !user.security?.showInstagram &&
      !user.security?.showVk &&
      !user.security?.showEmail
    )
      return null
  }

  const encodedMessage =
    message !== undefined || message !== null
      ? encodeURIComponent(message)
      : undefined

  return (
    <div
      className={cn(
        ' items-center gap-y-2 my-1',
        grid
          ? 'grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3'
          : 'flex flex-wrap',
        withTitle ? 'gap-x-3' : 'gap-x-2',
        className
      )}
    >
      {user?.phone &&
        (canSeeAllContacts ||
          (isMemberAndUserIsMember && user.security?.showPhone)) && (
          <Btn
            icon={message || smsViaPhone ? faSms : faPhone}
            className="text-yellow-600"
            url={
              message
                ? `sms:+${user.phone}?body=${encodedMessage}`
                : smsViaPhone
                  ? `sms:+${user.phone}`
                  : `tel:+${user.phone}`
            }
            title={'+' + user.phone}
          />
        )}
      {user?.whatsapp
        ? ((isMemberAndUserIsMember && user.security?.showWhatsapp) ||
            canSeeAllContacts) && (
            <Btn
              icon={faWhatsapp}
              className="text-green-600"
              url={`https://wa.me/${user.whatsapp}${
                message ? `?text=${encodedMessage}` : ''
              }`}
              title={'+' + user.whatsapp}
            />
          )
        : forceWhatsApp &&
          ((isMemberAndUserIsMember && user.security?.showWhatsapp) ||
            canSeeAllContacts) && (
            <Btn
              icon={faWhatsapp}
              className="text-red-400"
              url={`https://wa.me/${user.phone}${
                message ? `?text=${encodedMessage}` : ''
              }`}
              title={'+' + user.phone}
            />
          )}
      {!message &&
        user?.viber &&
        ((isMemberAndUserIsMember && user.security?.showViber) ||
          canSeeAllContacts) && (
          <Btn
            icon={faViber}
            className="text-purple-600"
            url={'viber://chat?number=' + user.viber}
            title={'+' + user.viber}
          />
        )}

      {!message &&
        (user?.telegram
          ? ((isMemberAndUserIsMember && user.security?.showTelegram) ||
              canSeeAllContacts) && (
              <Btn
                icon={faTelegramPlane}
                className="text-blue-600"
                url={`https://t.me/${user.telegram}`}
                title={'@' + user.telegram}
              />
            )
          : forceTelegram &&
            ((isMemberAndUserIsMember && user.security?.showTelegram) ||
              canSeeAllContacts) && (
              <Btn
                icon={faTelegramPlane}
                className="text-red-400"
                url={`https://t.me/+${user.phone}${
                  message ? `?text=${encodedMessage}` : ''
                }`}
                title={'+' + user.phone}
              />
            ))}
      {!message &&
        user?.instagram &&
        ((isMemberAndUserIsMember && user.security?.showInstagram) ||
          canSeeAllContacts) && (
          <Btn
            icon={faInstagram}
            className="text-yellow-700"
            url={'https://instagram.com/' + user.instagram}
            title={'@' + user.instagram}
          />
        )}
      {!message &&
        user?.vk &&
        ((isMemberAndUserIsMember && user.security?.showVk) ||
          canSeeAllContacts) && (
          <Btn
            icon={faVk}
            url={'https://vk.com/' + user.vk}
            className="text-blue-600"
            title={'@' + user.vk}
          />
        )}
      {!message &&
        user?.email &&
        ((isMemberAndUserIsMember && user.security?.showEmail) ||
          canSeeAllContacts) && (
          <Btn
            icon={faEnvelope}
            className="text-red-400"
            url={'mailto:' + user.email}
            title={user.email}
          />
        )}
    </div>
  )
}

export default ContactsIconsButtons
