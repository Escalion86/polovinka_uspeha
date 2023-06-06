import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyUserLinkToClipboard = (userId) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(window.location.origin + '/user/' + userId)
    info('Ссылка на пользователя скопирована в буфер обмена')
  }
}

export default useCopyUserLinkToClipboard
