import Divider from '../../components/Divider'
import Button from '../../components/Button'
import isObject from '@helpers/isObject'

const ModalButtons = ({
  confirmName = 'Подтвердить',
  confirmName2,
  declineName = 'Отмена',
  onConfirmClick,
  onConfirm2Click,
  onDeclineClick,
  showConfirm = true,
  showConfirm2,
  showDecline = true,
  disableConfirm = false,
  disableDecline = false,
  children,
  closeButtonShow,
  closeModal,
  bottomLeftButton,
  bottomLeftComponent,
}) => {
  if (!showConfirm && !showDecline && !closeButtonShow) return null
  return (
    <>
      <Divider light thin />
      <div className="flex flex-wrap justify-between px-2 tablet:px-3 tablet:pt-1">
        {children}
        <div className="flex justify-end flex-1 gap-x-1 tablet:gap-x-2">
          {isObject(bottomLeftButton) ? (
            <div className="flex-1">{<Button {...bottomLeftButton} />}</div>
          ) : null}
          {isObject(bottomLeftComponent) ? (
            <div className="flex-1">{bottomLeftComponent}</div>
          ) : null}
          {showConfirm && (
            <Button
              name={confirmName}
              classBgColor="bg-general"
              onClick={onConfirmClick}
              disabled={disableConfirm}
            />
          )}
          {showConfirm2 && (
            <Button
              name={confirmName2}
              classBgColor="bg-general"
              onClick={onConfirm2Click}
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
