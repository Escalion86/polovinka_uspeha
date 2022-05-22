import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import {
  faArrowDown,
  faArrowUp,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'

const CardButton = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <div
    className={cn(
      `duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
      e.stopPropagation()
      onClick && onClick()
    }}
    data-tip={dataTip}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    <ReactTooltip
      effect="solid"
      delayShow={400}
      // backgroundColor="white"
      // textColor="black"
      // border
      // borderColor="gray"
      type="dark"
    />
  </div>
)

const CardButtons = ({
  item,
  typeOfItem,
  showOnSiteOnClick,
  onUpClick,
  onDownClick,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  // const router = useRouter()

  // const refreshPage = () => {
  //   router.replace(router.asPath)
  // }

  return (
    <div className="flex">
      {onUpClick && (
        <CardButton
          icon={faArrowUp}
          onClick={onUpClick}
          color="gray"
          dataTip="Переместить выше"
        />
      )}
      {onDownClick && (
        <CardButton
          icon={faArrowDown}
          onClick={onDownClick}
          color="gray"
          dataTip="Переместить ниже"
        />
      )}
      <CardButton
        icon={faPencilAlt}
        onClick={() => modalsFunc[typeOfItem].edit(item._id)}
        color="orange"
        dataTip="Редактировать"
      />
      {typeOfItem !== 'user' && typeOfItem !== 'review' && (
        <CardButton
          icon={faCopy}
          onClick={() => modalsFunc[typeOfItem].add(item._id)}
          color="blue"
          dataTip="Клонировать"
        />
      )}
      {showOnSiteOnClick && (
        <CardButton
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={() => showOnSiteOnClick()}
          color="purple"
          dataTip="Показывать на сайте"
        />
      )}
      <CardButton
        icon={faTrashAlt}
        onClick={() => modalsFunc[typeOfItem].delete(item._id)}
        color="red"
        dataTip="Удалить"
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
