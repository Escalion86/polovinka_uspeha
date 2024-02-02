import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const {
  faWhatsapp,
  faViber,
  faTelegramPlane,
  faInstagram,
  faVk,
} = require('@fortawesome/free-brands-svg-icons')
const { faPhone, faSms } = require('@fortawesome/free-solid-svg-icons')

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
}) => {
  const Btn = withTitle ? ContactIconBtnWithTitle : ContactIconBtn
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)

  const canSeeAllContacts =
    forceShowAll || loggedUserActiveRole?.users?.seeAllContacts

  if (
    !canSeeAllContacts &&
    user.security?.showContacts === false &&
    !user.security?.showPhone &&
    !user.security?.showWhatsapp &&
    !user.security?.showViber &&
    !user.security?.showTelegram &&
    !user.security?.showInstagram &&
    !user.security?.showVk &&
    !user.security?.showEmail
  )
    return null

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
        (user.security?.showContacts ||
          user.security?.showPhone ||
          canSeeAllContacts) && (
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
        ? (user.security?.showContacts ||
            user.security?.showWhatsapp ||
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
        : forceWhatsApp && (
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
        (user.security?.showContacts ||
          user.security?.showViber ||
          canSeeAllContacts) && (
          <Btn
            icon={faViber}
            className="text-purple-600"
            url={'viber://chat?number=' + user.viber}
            title={'+' + user.viber}
          />
        )}

      {!message &&
        user?.telegram &&
        (user.security?.showContacts ||
          user.security?.showTelegram ||
          canSeeAllContacts) && (
          <Btn
            icon={faTelegramPlane}
            className="text-blue-600"
            url={`https://t.me/${user.telegram}`}
            title={'@' + user.telegram}
          />
        )}
      {!message &&
        user?.instagram &&
        (user.security?.showContacts ||
          user.security?.showInstagram ||
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
        (user.security?.showContacts ||
          user.security?.showVk ||
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
        (user.security?.showContacts ||
          user.security?.showEmail ||
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
