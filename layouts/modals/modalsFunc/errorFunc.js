import React from 'react'

import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { GENDERS, ORIENTATIONS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
import ContactsIconsButtons from '@components/ContactsIconsButtons'
import birthDateToAge from '@helpers/birthDateToAge'
import UserName from '@components/UserName'
import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import copyToClipboard from '@helpers/copyToClipboard'
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from '@material-tailwind/react'

function replaceErrors(key, value) {
  if (value instanceof Error) {
    var error = {}

    Object.getOwnPropertyNames(value).forEach(function (propName) {
      error[propName] = value[propName]
    })

    return error
  }

  return value
}

const errorFunc = (data) => {
  const ErrorModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const json = JSON.stringify(data, replaceErrors, 4)

    return (
      <div>
        <pre>
          <code>{json}</code>
        </pre>
        <div onClick={() => copyToClipboard(json)}>
          <Popover>
            <PopoverHandler>
              <div className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded cursor-pointer group">
                Копировать в буфер обмена
              </div>
            </PopoverHandler>
            <PopoverContent className="z-50">
              Тест скопирован в буфер обмена
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  }

  return {
    title: `ОШИБКА`,
    declineButtonName: 'Закрыть',
    Children: ErrorModal,
    showDecline: true,
    showConfirm: false,
  }
}

export default errorFunc
