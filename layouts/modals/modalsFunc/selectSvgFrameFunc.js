import frames from '@components/frames/frames'
import { useState } from 'react'

const selectSvgFrameFunc = (itemId, onChange) => {
  const SelectSvgFrameModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const [selectedItem, setSelectedItem] = useState(itemId)

    const onSelect = (id) => {
      closeModal()
      onChange(id)
    }

    return (
      <div className="flex flex-wrap w-full h-full max-h-full gap-1">
        <div
          className="flex items-center justify-center text-2xl text-center text-disabled border border-gray-600 cursor-pointer w-[100px] h-[100px] hover:bg-green-300"
          onClick={() => onSelect(null)}
        >
          БЕЗ РАМКИ
        </div>
        {frames.map(({ id, Frame }) => (
          <div
            key={id}
            className="border border-gray-600 cursor-pointer hover:bg-green-300 h-[100px]"
            onClick={() => onSelect(id)}
          >
            <Frame width="100" height="100" />
          </div>
        ))}
      </div>
    )
  }

  return {
    title: 'Выберите рамку',
    confirmButtonName: 'Применить',
    Children: SelectSvgFrameModal,
  }
}

export default selectSvgFrameFunc
