import modalsFuncAtom from '@state/modalsFuncAtom'
import isSiteLoadingAtom from '@state/atoms/isSiteLoadingAtom'
import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

const CheckBrowserUpdate = ({ isCabinet }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const isSiteLoading = useAtomValue(isSiteLoadingAtom)

  useEffect(() => {
    if (modalsFunc && !isSiteLoading) {
      if (isCabinet) {
        const url = isBrowserNeedToBeUpdate()
        if (url) modalsFunc.browserUpdate(url)
      }
    }
  }, [isCabinet, modalsFunc, isSiteLoading])

  return null
}

export default CheckBrowserUpdate
