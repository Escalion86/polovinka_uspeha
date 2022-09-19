import React from 'react'
import copyToClipboard from '@helpers/copyToClipboard'
import useSnackbar from '@helpers/useSnackbar'

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
    const { info } = useSnackbar()

    return (
      <div>
        <pre>
          <code>{json}</code>
        </pre>
        <div
          onClick={() => {
            info('Данные скопированы в буфер обмена')
            copyToClipboard(json)
          }}
        >
          <div className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded cursor-pointer group">
            Копировать в буфер обмена
          </div>
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
