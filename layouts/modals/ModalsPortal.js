import React, { useEffect } from 'react'
import { modalsAtom, modalsFuncAtom } from '@state/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import Modal from './Modal'
import { useRouter } from 'next/router'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

function ModalsPortal() {
  const [modals, setModals] = useRecoilState(modalsAtom)
  const itemsFunc = useRecoilValue(itemsFuncAtom)
  const setModalsFunc = useSetRecoilState(modalsFuncAtom)

  useEffect(() => setModalsFunc(modalsFuncGenerator(setModals, itemsFunc)), [])

  return modals.map((modalProps, index) => (
    <Modal {...modalProps} index={index} key={'modal' + index} />
  ))
}

export default ModalsPortal
