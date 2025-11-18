import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSnackbar as notistackUseSnackbar } from 'notistack'
import { useMemo } from 'react'

const VARIANTS = ['default', 'error', 'success', 'warning', 'info']

const useSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = notistackUseSnackbar()

  return useMemo(() => {
    const createCloseAction = (key) => (
      <FontAwesomeIcon
        onClick={() => closeSnackbar(key)}
        icon={faTimes}
        className="w-6 h-6 cursor-pointer"
      />
    )

    const buildNotifier = (variant) => (text, props = {}) => {
      const key = enqueueSnackbar(text, {
        open: true,
        variant,
        className: 'flex flex-nowrap',
        action: createCloseAction,
        ...props,
      })
      return key
    }

    return VARIANTS.reduce((acc, variant) => {
      acc[variant] = buildNotifier(variant)
      return acc
    }, {})
  }, [closeSnackbar, enqueueSnackbar])
}

export default useSnackbar
