'use client'

import Button from '@components/Button'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtomValue } from 'jotai'

const DevContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)

  return (
    <div className="flex flex-col gap-y-0.5">
      <Button name="AI" onClick={() => modalsFunc.external.ai()} />
    </div>
  )
}

export default DevContent
