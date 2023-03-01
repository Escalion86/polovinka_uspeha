import React from 'react'
import { modalsAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Modal from './Modal'

function ModalsPortal() {
  const modals = useRecoilValue(modalsAtom)

  return (
    <div className="fixed top-0 z-50 w-full">
      {modals.map(({ id, props }) => (
        <Modal {...props} id={id} key={'modal' + id} />
      ))}
    </div>
  )
}

export default ModalsPortal
