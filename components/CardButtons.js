import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import {
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import { putData } from '@helpers/CRUD'
import cn from 'classnames'

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

export default CardButtons
