import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const {
  faWhatsapp,
  faViber,
  faTelegramPlane,
  faInstagram,
  faVk,
} = require('@fortawesome/free-brands-svg-icons')
const { faPhone } = require('@fortawesome/free-solid-svg-icons')

const ContactIconBtn = ({ url, icon, size = 'lg', className = null }) => (
  <FontAwesomeIcon
    className={cn(
      'h-6 cursor-pointer text-primary hover:text-toxic duration-300 hover:scale-125',
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

const ContactsIconsButtons = ({ user }) => (
  <div className="flex flex-wrap items-center justify-end py-1 gap-x-2 gap-y-1">
    {user?.phone && (
      <ContactIconBtn
        icon={faPhone}
        className="text-yellow-600"
        url={'tel:+' + user.phone}
      />
    )}
    {user?.whatsapp && (
      <ContactIconBtn
        icon={faWhatsapp}
        className="text-green-600"
        url={'https://wa.me/' + user.whatsapp}
      />
    )}
    {user?.viber && (
      <ContactIconBtn
        icon={faViber}
        className="text-purple-600"
        url={'viber://chat?number=' + user.viber}
      />
    )}
    {user?.telegram && (
      <ContactIconBtn
        icon={faTelegramPlane}
        className="text-blue-600"
        url={'https://t.me/' + user.telegram}
      />
    )}
    {user?.instagram && (
      <ContactIconBtn
        icon={faInstagram}
        className="text-yellow-700"
        url={'https://instagram.com/' + user.instagram}
      />
    )}
    {user?.vk && (
      <ContactIconBtn
        icon={faVk}
        url={'https://vk.com/' + user.vk}
        className="text-blue-600"
      />
    )}
    {user?.email && (
      <ContactIconBtn
        icon={faEnvelope}
        className="text-red-400"
        url={'mailto:' + user.email}
      />
    )}
  </div>
)

export default ContactsIconsButtons
