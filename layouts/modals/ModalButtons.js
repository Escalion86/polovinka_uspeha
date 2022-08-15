import Divider from '../../components/Divider'
import Button from '../../components/Button'

const ModalButtons = ({
  confirmName = 'Подтвердить',
  declineName = 'Отмена',
  onConfirmClick,
  onDeclineClick,
  showConfirm = true,
  showDecline = true,
}) => {
  if (!showConfirm && !showDecline) return null
  return (
    <>
      <Divider light thin />
      <div className="flex justify-end gap-x-1 tablet:gap-x-2">
        {showDecline && (
          <Button
            name={declineName}
            classBgColor="bg-danger"
            onClick={onDeclineClick}
          />
        )}
        {showConfirm && (
          <Button
            name={confirmName}
            classBgColor="bg-general"
            onClick={onConfirmClick}
          />
        )}
      </div>
    </>
  )
}

export default ModalButtons
