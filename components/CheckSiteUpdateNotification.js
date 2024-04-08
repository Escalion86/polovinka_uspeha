import { useEffect } from 'react'

import useSnackbar from '@helpers/useSnackbar'
import { useRouter } from 'next/router'

import { useHasNewDeploy } from 'next-deploy-notifications'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh'

const CheckSiteUpdateNotification = () => {
  let { hasNewDeploy } = useHasNewDeploy()

  const snackbar = useSnackbar()

  const router = useRouter()

  useEffect(() => {
    if (hasNewDeploy)
      snackbar.warning('Необходимо обновить сайт', {
        autoHideDuration: null,
        SnackbarProps: {
          onClick: () => {
            router.reload()
          },
        },
        className: 'cursor-pointer',
        action: (
          // <div className="w-8 -ml-2">
          <FontAwesomeIcon
            // onClick={() => {
            //   router.reload()
            // }}
            icon={faRefresh}
            className="w-6 h-6 cursor-pointer"
          />
          // </div>
        ),
        preventDuplicate: true,
      })
  }, [hasNewDeploy])

  return null
}

export default CheckSiteUpdateNotification
