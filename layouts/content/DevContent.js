'use client'

import Button from '@components/Button'
import { CardWrapper } from '@components/CardWrapper'
import asyncEventsUsersAllAtom from '@state/async/asyncEventsUsersAllAtom'
import asyncEventsUsersAllSelector from '@state/async/asyncEventsUsersAllSelector'
import { modalsFuncAtom } from '@state/atoms'
import eventsAtom from '@state/atoms/eventsAtom'
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import { postData } from '@helpers/CRUD'
import { useEffect, useState } from 'react'
import Input from '@components/Input'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const events = useRecoilValue(eventsAtom)
  // console.log('1 :>> ', 1)
  const [test, setTest] = useState()
  const [input, setInput] = useState('')
  console.log('test :>> ', test)

  const getVKUsers = async () => {
    try {
      fetch(
        'http://localhost:8010/proxy/method/groups.getMembers?v=5.199&group_id=club211960308&filter=managers&fields=photo_100,sex&access_token=vk1.a.8gReE2Oh7a8AHQNV2YetAedjn_LrvLyOQa2I29oao9_TmD3VJuv3-XsMSuHPfe5yZB7QepLL7kwjkvj30guPWq2--n5pYUuQWesQImdCqfSDY6jzSIciiQRE6RJk4zPPViAMSup_WXKAYwtUnJQIpn6qynVwDEbbpAe3Tj7zds1fJVT_4S7TBg66EIOvCT4Pg37VwkC8YjEACg31FIUysQ'
      )
        .then((res) => res.json())
        .then((res) => setTest(res.response?.items))

      // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      // return res
    } catch (e) {
      console.log('e :>> ', e)
    }
  }

  const sendMessage = async (id, msg) => {
    try {
      fetch(
        `http://localhost:8010/proxy/method/messages.send?v=5.199&message=${msg}&user_id=${id}&random_id=0&access_token=vk1.a.8gReE2Oh7a8AHQNV2YetAedjn_LrvLyOQa2I29oao9_TmD3VJuv3-XsMSuHPfe5yZB7QepLL7kwjkvj30guPWq2--n5pYUuQWesQImdCqfSDY6jzSIciiQRE6RJk4zPPViAMSup_WXKAYwtUnJQIpn6qynVwDEbbpAe3Tj7zds1fJVT_4S7TBg66EIOvCT4Pg37VwkC8YjEACg31FIUysQ`
      )
      // .then((res) => res.json())
      // .then((res) => setTest(res.response?.items))

      // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      // return res
    } catch (e) {
      console.log('e :>> ', e)
    }
  }
  // const users = useRecoilValue(usersAtom)
  // const eventsUsers = useAtom(
  //   asyncEventsUsersAllAtom,
  //   asyncEventsUsersAllSelector
  // )

  // const eventsUsers = useGetRecoilValueInfo_UNSTABLE()(asyncEventsUsersAllAtom)
  // console.log('eventsUsers :>> ', eventsUsers)

  // useEffect(() => {}, [])

  return (
    <div className="flex flex-col gap-y-0.5">
      <Button name="test" onClick={() => getVKUsers()} />
      <Input name="input" onChange={setInput} value={input} />
      {test &&
        test.map(({ id, first_name, last_name, photo_100, sex }) => {
          const userGender = sex === 1 ? GENDERS[1] : GENDERS[0]
          return (
            <div className="flex items-center border border-gray-400">
              <div
                className={cn(
                  'w-8 flex justify-center items-center h-full',
                  userGender ? 'bg-' + userGender.color : 'bg-gray-400'
                )}
              >
                <FontAwesomeIcon
                  className="w-6 h-6 text-white"
                  icon={userGender.icon}
                />
              </div>
              <img src={photo_100} className="w-9 h-9" />
              <div className="flex-1 px-1">
                {first_name} {last_name}
              </div>
              <Button name="send" onClick={() => sendMessage(id, input)} />
            </div>
          )
        })}
      {/* {events.map((events) => (
        <div key={events._id}>{events._id}</div>
      ))} */}
      {/* {eventsUsers.map((eventUser) => (
        <div key={eventUser._id}>{eventUser._id}</div>
      ))} */}
    </div>
  )
}

export default DevContent
