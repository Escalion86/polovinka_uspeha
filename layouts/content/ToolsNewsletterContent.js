import Button from '@components/Button'
import ComboBox from '@components/ComboBox'

import Input from '@components/Input'
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
  const [instance, setInstance] = useState()

  useEffect(() => {
    fetch(
      'https://biz.wapico.ru/api/createinstance.php?access_token=4c44591c16e8cf79acb18e92349a7f0c',
      requestOptions
    )
      .then((response) => {
        console.log('response :>> ', response)
        return response.json()
      })
      .then((result) => {
        setInstance(result.instance_id)
      })
      .catch((error) => console.log('error', error))
  }, [])
  return <div className="h-full max-h-full px-1 overflow-y-auto"></div>
}

export default ToolsNewsletterContent
