import Button from '@components/Button'
import { CardWrapper } from '@components/CardWrapper'
import asyncEventsUsersAllAtom from '@state/asyncSelectors/asyncEventsUsersAllAtom'
import asyncEventsUsersAllSelector from '@state/asyncSelectors/asyncEventsUsersAllSelector'
import { modalsFuncAtom } from '@state/atoms'
import eventsAtom from '@state/atoms/eventsAtom'
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'

const DevCard = ({ title, data }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <CardWrapper
      // loading={loading}
      // onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
      // showOnSite={direction.showOnSite}
      onClick={() => modalsFunc.json(data)}
    >
      <div className="flex items-center px-1 gap-x-2">
        <div className="text-xl font-bold">{title}</div>
        <span className="text-xl font-bold text-red-600">{data.length}</span>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      </div>
    </CardWrapper>
  )
}

const useAtom = (atom, selector) => {
  const eventsUsers = useRecoilValueLoadable(atom).valueMaybe()
  if (!eventsUsers) {
    console.log('get selector :>> ')
    const setAtom = useSetRecoilState(atom)
    const selectorState = useRecoilValue(selector)
    setAtom(selectorState)
    return selectorState
  } else {
    console.log('get atom :>> ')
    return useRecoilValue(atom)
  }
}

const DevContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  // console.log('1 :>> ', 1)
  const [test, setTest] = useRecoilState(asyncEventsUsersAllAtom)
  console.log('test :>> ', test)
  // const users = useRecoilValue(usersAtom)
  const eventsUsers = useAtom(
    asyncEventsUsersAllAtom,
    asyncEventsUsersAllSelector
  )

  // const eventsUsers = useGetRecoilValueInfo_UNSTABLE()(asyncEventsUsersAllAtom)
  // console.log('eventsUsers :>> ', eventsUsers)

  return (
    <div className="flex flex-col">
      <Button name="test" onClick={() => setTest('123')} />
      {events.map((events) => (
        <div key={events._id}>{events._id}</div>
      ))}
      {/* {eventsUsers.map((eventUser) => (
        <div key={eventUser._id}>{eventUser._id}</div>
      ))} */}
    </div>
  )
}

export default DevContent
