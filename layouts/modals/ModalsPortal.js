import React, { useEffect } from 'react'
import { modalsAtom, modalsFuncAtom } from '@state/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import Modal from './Modal'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { useRouter } from 'next/router'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

function ModalsPortal() {
  const [modals, setModals] = useRecoilState(modalsAtom)
  const itemsFunc = useRecoilValue(itemsFuncAtom)
  const setModalsFunc = useSetRecoilState(modalsFuncAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const router = useRouter()

  useEffect(() => {
    setModalsFunc(modalsFuncGenerator(setModals, itemsFunc, router, loggedUser))
  }, [loggedUser, itemsFunc])

  return (
    <div className="fixed top-0 z-50 w-full">
      {modals.map(({ id, props }) => (
        <Modal {...props} id={id} key={'modal' + id} />
      ))}
    </div>
  )
}

export default ModalsPortal
