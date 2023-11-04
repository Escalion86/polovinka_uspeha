import DevSwitch from '@components/DevSwitch'
import Divider from '@components/Divider'
import Menu from '@components/Menu'
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faBug } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import UserMenu from './UserMenu'
import UserStatusIcon from '@components/UserStatusIcon'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import DropDown from '@components/DropDown'

const CabinetHeader = ({ title = '', titleLink, icon }) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)

  if (!loggedUser) return null

  return (
    <div
      className="relative z-20 flex items-center justify-end w-full h-16 px-3 text-white bg-black gap-x-4"
      style={{ gridArea: 'header' }}
    >
      {title ? (
        <div className="flex items-center flex-1">
          <Link href="/" shallow>
            <a className="hidden tablet:block">
              <img
                className="rounded-full h-14"
                src={icon || '/img/logo_heart.png'}
                alt="logo"
                // width={48}
                // height={48}
              />
            </a>
          </Link>
          <div className="flex flex-1">
            <Divider type="vertical" className="hidden tablet:block" />
            {titleLink ? (
              <Link href={titleLink} shallow>
                <a className="hover:text-gray-300">
                  <h1>{title}</h1>
                </a>
              </Link>
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link href="/" shallow>
            <a>
              <img
                className="h-12"
                src="/img/logo_horizontal.png"
                alt="logo"
                // width={40}
                // height={40}
              />
            </a>
          </Link>
        </div>
      )}
      {loggedUser.role === 'dev' && (
        <Menu
          trigger={
            <div className="flex items-center justify-center w-6 h-6">
              <FontAwesomeIcon icon={faBug} className="w-5 h-5 text-white" />
            </div>
          }
        >
          <DevSwitch />
        </Menu>
      )}
      <DropDown
        trigger={<UserStatusIcon status={loggedUserActiveStatus} />}
        // className={className}
        menuPadding={false}
        openOnHover
        // placement="right"
      >
        <div className="flex flex-col justify-center px-3 py-1 leading-5 text-black cursor-default w-80">
          {!loggedUserActiveStatus || loggedUserActiveStatus === 'novice' ? (
            <>
              <span className="font-bold">Ваш статус: Новичок</span>
              <span>
                После посещения хотя-бы одного мероприятия вы сможете вступить в
                клуб!
              </span>
              <span className="mt-1">
                Участники клуба имеют следующие привелегии:
              </span>
            </>
          ) : (
            <>
              <span className="font-bold">Ваш статус: Участник клуба</span>
              <div className="flex flex-col items-start">
                <div>Ваши привелегии:</div>{' '}
              </div>
            </>
          )}
          <div>- Доступ к закрытым мероприятиям</div>
          <div>- Просмотр других участников клуба</div>
          <div>- Просмотр участников мероприятий</div>
          <div>- Страница достижений и личная статистика</div>
          <div>- Доступ к закрытому чату</div>
          {!loggedUserActiveStatus ||
            (loggedUserActiveStatus === 'novice' && (
              <div className="flex flex-col font-bold">
                <span>Для вступления в клуб свяжитесь с администратором:</span>
                <div className="flex font-bold gap-x-2">
                  <a
                    className="flex items-center px-2 py-1 text-white duration-300 bg-green-500 rounded-md hover:bg-general gap-x-1"
                    href="https://wa.me/79504280891"
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="w-5 h-5 text-white"
                    />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    className="flex items-center px-2 py-1 text-white duration-300 bg-blue-500 rounded-md hover:bg-general gap-x-1"
                    href="https://t.me/polovinka_krsk"
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faTelegram}
                      className="w-5 h-5 text-white"
                    />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            ))}
        </div>
      </DropDown>
      <UserMenu />
    </div>
  )
}

export default CabinetHeader
