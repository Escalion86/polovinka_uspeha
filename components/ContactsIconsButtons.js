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

const ContactsIconsButtons = ({ user, withTitle, grid, className }) => {
  const Btn = withTitle ? ContactIconBtnWithTitle : ContactIconBtn
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
      {user?.phone && (
        <Btn
          icon={faPhone}
          className="text-yellow-600"
          url={'tel:+' + user.phone}
          title={'+' + user.phone}
        />
      )}
      {user?.whatsapp && (
        <Btn
          icon={faWhatsapp}
          className="text-green-600"
          url={'https://wa.me/' + user.whatsapp}
          title={'+' + user.whatsapp}
        />
      )}
      {user?.viber && (
        <Btn
          icon={faViber}
          className="text-purple-600"
          url={'viber://chat?number=' + user.viber}
          title={'+' + user.viber}
        />
      )}
      {user?.telegram && (
        <Btn
          icon={faTelegramPlane}
          className="text-blue-600"
          url={'https://t.me/' + user.telegram}
          title={'@' + user.telegram}
        />
      )}
      {user?.instagram && (
        <Btn
          icon={faInstagram}
          className="text-yellow-700"
          url={'https://instagram.com/' + user.instagram}
          title={'@' + user.instagram}
        />
      )}
      {user?.vk && (
        <Btn
          icon={faVk}
          url={'https://vk.com/' + user.vk}
          className="text-blue-600"
          title={'@' + user.vk}
        />
      )}
      {user?.email && (
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
