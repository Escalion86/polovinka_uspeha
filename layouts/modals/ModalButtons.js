import Divider from '../../components/Divider'
import Button from '../../components/Button'

const ModalButtons = ({
  confirmName = 'Подтвердить',
  declineName = 'Отмена',
  onConfirmClick,
  onDeclineClick,
}) => (
  <>
    <Divider light thin />
    <div className="flex justify-end">
      <Button
        name={declineName}
        classBgColor="bg-danger"
        onClick={onDeclineClick}
      />
      <Button
        name={confirmName}
        classBgColor="bg-general"
        onClick={onConfirmClick}
      />
    </div>
  </>
)

export default ModalButtons
