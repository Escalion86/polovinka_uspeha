import Divider from '@components/Divider'
import menuOpenAtom from '@state/atoms/menuOpen'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useSetRecoilState } from 'recoil'

const CabinetHeader = ({ user, title = '', titleLink, icon }) => {
  const setMenuOpen = useSetRecoilState(menuOpenAtom)
  return (
    <div
      className="relative flex items-center justify-end w-full h-16 px-3 text-white bg-black"
      style={{ gridArea: 'header' }}
    >
      {title && (
        <>
          <Link href="/">
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
              <Link href={titleLink}>
                <a className="hover:text-gray-300">
                  <h1>{title}</h1>
                </a>
              </Link>
            ) : (
              <h1>{title}</h1>
            )}
          </div>
        </>
      )}
      {!title && (
        <div className="absolute z-10 -translate-x-1/2 left-1/2">
          <Link href="/">
            <a>
              <img
                className="h-12"
                src="/img/UniPlatform2.png"
                alt="uniPlatform"
                // width={40}
                // height={40}
              />
            </a>
          </Link>
        </div>
      )}
      {user ? (
        // <div>
        //   <img
        //     // onClick={() => closeMenu()}
        //     className="border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
        //     src={
        //       user?.image ??
        //       `/img/users/${user?.gender ? user.gender : 'male'}.jpg`
        //     }
        //     alt="Avatar"
        //   />
        // </div>
        <div className="z-10 flex items-start justify-end h-full px-2">
          <div className="relative flex flex-col items-end group mt-2.5 w-12">
            <img
              // onClick={() => closeMenu()}
              className="absolute z-10 border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9"
              src={
                user?.image ??
                `/img/users/${user?.gender ? user.gender : 'male'}.jpg`
              }
              alt="Avatar"
            />
            <div className="absolute top-0 z-0 w-0 h-0 overflow-hidden duration-300 scale-0 translate-x-[40%] -translate-y-1/2 group-hover:w-auto group-hover:h-auto group-hover:translate-y-0 group-hover:translate-x-0 group-hover:scale-100 border border-gray-800 rounded-tr-3xl">
              <div className="flex flex-col justify-center px-3 py-1 font-bold leading-4 text-white border-b border-gray-800 cursor-default bg-general rounded-tr-3xl h-11">
                <span>{user.name}</span>
                <span>{user.secondname}</span>
              </div>
              {/* <Link href="/cabinet">
                <a onClick={() => setMenuOpen(false)}>
                  <div className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white">
                    ?????? ??????????????
                  </div>
                </a>
              </Link> */}
              <Link href="/cabinet/questionnaire">
                <a onClick={() => setMenuOpen(false)}>
                  <div className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white">
                    ?????? ????????????
                  </div>
                </a>
              </Link>

              <div
                onClick={signOut}
                className="px-3 py-2 text-black bg-white border border-gray-300 cursor-pointer whitespace-nowrap hover:bg-gray-500 hover:text-white"
              >
                ?????????? ???? ?????????????? ????????????
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <a className="hover:text-gray-300">????????????????????????????</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default CabinetHeader
