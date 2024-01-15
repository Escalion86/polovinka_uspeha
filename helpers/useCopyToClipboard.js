import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyToClipboard = (text, snackbar) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(text)
    snackbar && info(snackbar)
  }
}

export default useCopyToClipboard
