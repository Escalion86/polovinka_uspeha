import Fab from '@components/Fab'
import {
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { putData } from '@helpers/CRUD'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

const CardButton = ({ active, icon, onClick }) => (
  <div
    className={cn(
      'flex border items-center justify-center w-8 h-8 hover:bg-red-600 border-red-500 hover:border-red-600 hover:text-white',
      active ? 'bg-red-500 text-white' : 'bg-white text-red-500'
    )}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
  </div>
)

const CardButtons = ({ item, typeOfItem }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  return (
    <div className="flex h-8 overflow-hidden">
      {item.showOnSite !== undefined && (
        <CardButton
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={async (e) => {
            e.stopPropagation()
            await putData(
              `/api/${typeOfItem}s/${item._id}`,
              {
                showOnSite: !item.showOnSite,
              },
              refreshPage
            )
          }}
        />
      )}
      <CardButton
        icon={faTrashAlt}
        onClick={(e) => {
          e.stopPropagation()
          modalsFunc[typeOfItem].delete(item)
        }}
      />
      {/* <div
  className={cn(
    'flex border items-center justify-center w-8 h-8 hover:bg-red-600 hover:text-white',
    direction.showOnSite
      ? 'bg-white border-red-500 text-red-500'
      : 'bg-red-500 text-white'
  )}
  onClick={async (e) => {
    e.stopPropagation()
    await putData(
      `/api/directions/${direction._id}`,
      {
        showOnSite: !direction.showOnSite,
      },
      refreshPage
    )
  }}
>
  <FontAwesomeIcon
    icon={direction.showOnSite ? faEye : faEyeSlash}
    className="w-6 h-6"
  />
</div> */}
    </div>
  )
}

const DirectionsContent = ({ user, events, directions, reviews }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <>
      {directions ? (
        directions.map((direction) => (
          <div
            key={direction._id}
            className="flex duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
            onClick={() => modalsFunc.direction.edit(direction)}
          >
            {direction.image && (
              // <div className="flex justify-center w-full tablet:w-auto">
              <img
                className="object-cover w-40 h-full tablet:w-48"
                src={direction.image}
                alt="direction"
                // width={48}
                // height={48}
              />
              // </div>
            )}
            <div className="w-full">
              <div className="flex">
                <div className="flex-1 px-2 py-1 text-xl font-bold ">
                  {direction.title}
                </div>
                <CardButtons item={direction} typeOfItem="direction" />
              </div>
              {/* <div>{direction.description}</div> */}
              <div
                className="px-2 py-1 text-sm "
                dangerouslySetInnerHTML={{ __html: direction.description }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-2">Нет направлений</div>
      )}
      <Fab onClick={() => modalsFunc.direction.edit()} show />
    </>
  )
}

export default DirectionsContent
