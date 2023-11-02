import Button from '@components/Button'
import ComboBox from '@components/ComboBox'

import Input from '@components/Input'
import { postData } from '@helpers/CRUD'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
// text/html; charset=UTF-8
var requestOptions = {
  // headers: {
  //   Accept: 'text/html',
  //   'Content-Type': 'text/html',
  // },
  method: 'POST',
  redirect: 'follow',
  // mode: 'cors',
}

const ToolsNewsletterContent = () => {
  const serverDate = new Date(useRecoilValue(serverSettingsAtom)?.dateTime)
  const [instanceId, setInstanceId] = useState('65410E28CF02E')

  const sendMessage = async ({ message, number }) => {
    // https://biz.wapico.ru/api/send.php?number=79999999xxx&type=text&message=test%20message&instance_id=642D8BD6EE***&access_token=c8278793a163891d4***************
    const result = await fetch(
      `https://biz.wapico.ru/api/send.php`, //?accenss_toke=4c44591c16e8cf79acb18e92349a7f0c',
      {
        // headers: {
        //   Accept: 'text/html',
        //   'Content-Type': 'text/html',
        // },
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
          access_token: '4c44591c16e8cf79acb18e92349a7f0c',
          instance_id: instanceId,
          number,
          message,
          type: 'text',
        }),
        // mode: 'cors',
      }
    )
      .then((response) => {
        // console.log('response :>> ', response)
        return response.json()
      })
      .then((result) => {
        console.log('result :>> ', result)
        setInstanceId(result.instance_id)
      })
      .catch((error) => console.log('error', error))

    return result
  }

  // useEffect(() => {
  //   fetch(
  //     'https://biz.wapico.ru/api/createinstance.php?access_token=4c44591c16e8cf79acb18e92349a7f0c',
  //     requestOptions
  //   )
  //     .then((response) => {
  //       // console.log('response :>> ', response)
  //       return response.json()
  //     })
  //     .then((result) => {
  //       console.log('result :>> ', result)
  //       setInstanceId(result.instance_id)
  //     })
  //     .catch((error) => console.log('error', error))
  // }, [])
  return (
    <div className="h-full max-h-full px-1 overflow-y-auto">
      <Button name="Отправить" onClick={() => sendMessage()} />
    </div>
  )
}

export default ToolsNewsletterContent
