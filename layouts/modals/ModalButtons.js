import Divider from '../../components/Divider'
import Button from '../../components/Button'

const ModalButtons = ({
  confirmName = 'Подтвердить',
  declineName = 'Отмена',
  onConfirmClick,
  onDeclineClick,
  showConfirm = true,
  showDecline = true,
  disableConfirm = false,
  disableDecline = false,
  children,
  closeButtonShow,
  closeModal,
}) => {
  if (!showConfirm && !showDecline && !closeButtonShow) return null
  return (
    <>
      <Divider light thin />
      <div className="flex flex-wrap justify-between px-2 tablet:px-3 tablet:pt-1">
        {children}
        <div className="flex justify-end flex-1 gap-x-1 tablet:gap-x-2">
          {showConfirm && (
            <Button
              name={confirmName}
              classBgColor="bg-general"
              onClick={onConfirmClick}
              disabled={disableConfirm}
            />
          )}
          {showDecline && (
            <Button
              name={declineName}
              classBgColor="bg-danger"
              onClick={onDeclineClick}
              disabled={disableDecline}
            />
          )}
          {closeButtonShow && (
            <Button
              name="Закрыть"
              classBgColor="bg-general"
              onClick={closeModal}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ModalButtons
