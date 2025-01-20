import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyUserLinkToClipboard = (location, userId) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(window.location.origin + '/' + location + '/user/' + userId)
    info('Ссылка на пользователя скопирована в буфер обмена')
  }
}

export default useCopyUserLinkToClipboard
