import React, { useEffect } from 'react'
import { modalsAtom, modalsFuncAtom } from '@state/atoms'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import Modal from './Modal'
import { useRouter } from 'next/router'

function ModalsPortal() {
  const [modals, setModals] = useRecoilState(modalsAtom)
  const setModalsFunc = useSetRecoilState(modalsFuncAtom)

  useEffect(() => setModalsFunc(modalsFuncGenerator(setModals)), [])

  return modals.map((modalProps, index) => (
    <Modal {...modalProps} index={index} key={'modal' + index} />
  ))
}

export default ModalsPortal
