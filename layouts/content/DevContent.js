'use client'

import Button from '@components/Button'
import CardWrapper from '@components/CardWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import Input from '@components/Input'
import { GENDERS } from '@helpers/constants'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormData from 'form-data'

// const DevCard = ({ title, data }) => {
//   const modalsFunc = useAtomValue(modalsFuncAtom)

//   return (
//     <CardWrapper
//       // loading={loading}
//       // onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
//       // showOnSite={direction.showOnSite}
//       onClick={() => modalsFunc.json(data)}
//     >
//       <div className="flex items-center px-1 gap-x-2">
//         <div className="text-xl font-bold">{title}</div>
//         <span className="text-xl font-bold text-red-600">{data.length}</span>
//         {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
//       </div>
//     </CardWrapper>
//   )
// }

// const useAtom = (atom, selector) => {
//   const eventsUsers = useAtomValueLoadable(atom).valueMaybe()
//   if (!eventsUsers) {
//     console.log('get selector :>> ')
//     const setAtom = useSetAtom(atom)
//     const selectorState = useAtomValue(selector)
//     setAtom(selectorState)
//     return selectorState
//   } else {
//     console.log('get atom :>> ')
//     return useAtomValue(atom)
//   }
// }

const DevContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  // const events = useAtomValue(eventsAtom)
  // console.log('1 :>> ', 1)
  const [test, setTest] = useState()
  const [input, setInput] = useState('')

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

  const kad = async () => {
    const formData = new FormData()
    formData.append('model_id', 4)
    formData.append(
      'params',
      JSON.stringify({
        type: 'GENERATE',
        style: 'KANDINSKY',
        width: 1024,
        height: 1024,
        num_images: 1,
        negativePromptUnclip: 'яркие цвета, кислотность, высокая контрастность',
        generateParams: {
          query: 'Пушистый кот в очках',
        },
      })
    )

    await fetch('https://api-key.fusionbrain.ai/key/api/v1/text2image/run', {
      method: 'POST',
      body: formData,
      // body: JSON.stringify({
      //   type: 'GENERATE',
      //   style: 'string',
      //   width: 1024,
      //   height: 1024,
      //   num_images: 1,
      //   negativePromptUnclip: 'яркие цвета, кислотность, высокая контрастность',
      //   generateParams: {
      //     query: 'Пушистый кот в очках',
      //   },
      // }),
      // dataType: 'json',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Key': 'Key 562BA6392208E2488E142AD3CDA0E68A',
        'X-Secret': 'Secret 2AC0016C0754E4BC9D8CC64B2D7B0472',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        // if (data.secure_url !== '') {
        // if (callback) callback(data.secure_url)
        // return data.secure_url
        // }
        // if (callback) callback(data)
        return data
      })
      .catch((err) => console.error('ERROR', err))
  }

  return (
    <div className="flex flex-col gap-y-0.5">
      <Button name="kad" onClick={() => kad()} />
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
              <img src={photo_100} className="w-9 h-9" alt="dev" />
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
