import DevSwitch from '@components/DevSwitch'
import Menu from '@components/Menu'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import UserMenu from './UserMenu'
import UserStatusIcon from '@components/UserStatusIcon'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import DropDown from '@components/DropDown'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import Image from 'next/image'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

const CheckedItem = ({ children }) => (
  <li className="flex italic gap-x-1">
    <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-success" />
    {children}
  </li>
)

const CabinetHeader = ({ title = '', titleLink, icon }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveStatus = useAtomValue(loggedUserActiveStatusAtom)
  const isLoggedUserDev = useAtomValue(loggedUserAtom)?.role === 'dev'
  const isLoggedUserAdmin = useAtomValue(isLoggedUserAdminSelector)
  const siteSettings = useAtomValue(siteSettingsAtom)
  const headerInfo = siteSettings?.headerInfo

  if (!loggedUserActive) return null

  const isLoggedUserNovice =
    !loggedUserActiveStatus || loggedUserActiveStatus === 'novice'

  return (
    <div
      className="relative z-20 flex items-center justify-end w-full h-16 px-3 text-white bg-black gap-x-4"
      style={{ gridArea: 'header' }}
    >
      {title ? (
        <div className="flex items-center flex-1">
          <Link
            prefetch={false}
            href="/"
            shallow
            className="hidden tablet:block h-[56px] w-[44px] aspect-1 relative"
            // as="image"
            // rel="preload"
          >
            <Image
              className="rounded-full"
              src={icon || '/img/logo_heart.png'}
              alt="logo"
              fill
              // height={56}
              // width={44.33}
              // style={{ width: 'auto', height: 'auto' }}
              priority
              // placeholder="blur"
              // blurDataURL={'/img/logo_heart_24px.png'}
              sizes="(max-width: 125px) 100vw"
            />
          </Link>
          <div className="flex items-center flex-1 leading-4 min-h-[42px] tablet:border-gray-600 tablet:border-l-1 tablet:pl-3 tablet:ml-3">
            {titleLink ? (
              <Link
                prefetch={false}
                href={titleLink}
                shallow
                className="hover:text-gray-300"
              >
                <h1>{title}</h1>
              </Link>
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link prefetch={false} href="/" shallow>
            <img className="h-12" src="/img/logo_horizontal.png" alt="logo" />
          </Link>
        </div>
      )}
      {isLoggedUserAdmin && (
        <div
          className="flex items-center justify-center w-6 h-6 cursor-pointer"
          onClick={() => {
            modalsFunc.external.qrCodeGenerator({
              title: 'QR-код на текущую страницу',
            })
          }}
        >
          <FontAwesomeIcon icon={faQrcode} className="w-5 h-5 text-white" />
        </div>
      )}
      {isLoggedUserDev && (
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
        // menuPadding={false}
        openOnHover
      >
        <div className="flex flex-col justify-center px-3 py-1 leading-5 text-black bg-white rounded-md cursor-default w-80">
          {isLoggedUserNovice ? (
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
                <div>Ваши привелегии:</div>
              </div>
            </>
          )}
          <ul className="flex flex-col my-1 gap-y-1">
            <CheckedItem>Доступ к закрытым мероприятиям</CheckedItem>
            <CheckedItem>Просмотр других участников клуба</CheckedItem>
            <CheckedItem>Просмотр участников мероприятий</CheckedItem>
            <CheckedItem>Страница достижений и личная статистика</CheckedItem>
            <CheckedItem>Доступ к закрытому чату</CheckedItem>
          </ul>
          {isLoggedUserNovice ? (
            <div className="flex flex-col py-1 font-bold gap-y-1">
              <span>Для вступления в клуб свяжитесь с администратором:</span>
              {(headerInfo?.telegram || headerInfo?.whatsapp) && (
                <div className="flex font-bold gap-x-2">
                  {headerInfo?.whatsapp && (
                    <a
                      className="flex items-center px-2 py-1 text-white duration-300 bg-green-500 rounded-md hover:bg-general gap-x-1"
                      href={'https://wa.me/' + headerInfo?.whatsapp}
                      target="_blank"
                    >
                      <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="w-5 h-5 text-white"
                      />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {headerInfo?.telegram && (
                    <a
                      className="flex items-center px-2 py-1 text-white duration-300 bg-blue-500 rounded-md hover:bg-general gap-x-1"
                      href={'https://t.me/' + headerInfo?.telegram}
                      target="_blank"
                    >
                      <FontAwesomeIcon
                        icon={faTelegram}
                        className="w-5 h-5 text-white"
                      />
                      <span>Telegram</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            headerInfo?.memberChatLink && (
              <a
                className="flex items-center justify-center px-3 py-2 my-1 text-white duration-300 border rounded-lg gap-x-2 bg-general hover:text-general hover:bg-white border-general"
                href={'https://t.me/' + headerInfo?.memberChatLink}
                target="_blank"
              >
                <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                <span>Открыть чат клуба</span>
              </a>
            )
          )}
        </div>
      </DropDown>
      <UserMenu />
    </div>
  )
}

export default CabinetHeader
