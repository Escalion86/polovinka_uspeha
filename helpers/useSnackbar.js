import { useSnackbar as notistackUseSnackbar } from 'notistack'

const useSnackbar = () => {
  const { enqueueSnackbar } = notistackUseSnackbar()
  // default | error | success | warning | info
  return {
    default: (text) => enqueueSnackbar(text, { variant: 'default' }),
    error: (text) => enqueueSnackbar(text, { variant: 'error' }),
    success: (text) => enqueueSnackbar(text, { variant: 'success' }),
    warning: (text) => enqueueSnackbar(text, { variant: 'warning' }),
    info: (text) => enqueueSnackbar(text, { variant: 'info' }),
  }
}

export default useSnackbar
