import modalsAtom from '@state/atoms/modalsAtom'
import { useAtomValue } from 'jotai'
import Modal from './Modal'

function ModalsPortal() {
  const modals = useAtomValue(modalsAtom)

  return (
    <div className="fixed top-0 z-50 w-full">
      {modals.map(({ id, props }) => (
        <Modal {...props} id={id} key={'modal' + id} />
      ))}
    </div>
  )
}

export default ModalsPortal
