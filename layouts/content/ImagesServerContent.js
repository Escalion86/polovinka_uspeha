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

const ImagesServerContent = () => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const events = useRecoilValue(eventsAtom)

  const [test, setTest] = useState()

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

  return <div className="flex flex-col gap-y-0.5"></div>
}

export default ImagesServerContent
