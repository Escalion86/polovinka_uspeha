import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyEventLinkToClipboard = (eventId) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(window.location.origin + '/event/' + eventId)
    info('Ссылка на мероприятие скопирована в буфер обмена')
  }
}

export default useCopyEventLinkToClipboard
