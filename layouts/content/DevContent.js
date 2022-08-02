import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import getZodiac from '@helpers/getZodiac'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless } from '@fortawesome/free-solid-svg-icons'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import usersAtom from '@state/atoms/usersAtom'
import userSelector from '@state/selectors/userSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import { CardWrapper } from '@components/CardWrapper'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'

const DevCard = ({ title, data }) => {
  return (
    <CardWrapper
    // loading={loading}
    // onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
    // showOnSite={direction.showOnSite}
    >
      <div className="flex items-center px-1 gap-x-2">
        <div className="text-xl font-bold">{title}</div>
        <span className="text-xl font-bold text-red-600">{data.length}</span>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      </div>
    </CardWrapper>
  )
}

const DevContent = () => {
  const users = useRecoilValue(usersAtom)
  const eventsUsers = useRecoilValue(eventsUsersAtom)
  return (
    <div className="flex flex-col">
      <DevCard title="users" data={users} />
      <DevCard title="eventsUsers" data={eventsUsers} />
    </div>
  )
}

export default DevContent
