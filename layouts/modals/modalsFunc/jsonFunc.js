import React from 'react'
import copyToClipboard from '@helpers/copyToClipboard'
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from '@material-tailwind/react'

const jsonFunc = (data) => {
  const JSONModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const json = JSON.stringify(data, null, 4)

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
    title: `JSON`,
    declineButtonName: 'Закрыть',
    Children: JSONModal,
    showDecline: true,
    showConfirm: false,
  }
}

export default jsonFunc
