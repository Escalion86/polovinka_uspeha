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
}) => {
  if (!showConfirm && !showDecline) return null
  return (
    <>
      <Divider light thin />
      <div className="flex flex-wrap justify-between">
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
        </div>
      </div>
    </>
  )
}

export default ModalButtons
