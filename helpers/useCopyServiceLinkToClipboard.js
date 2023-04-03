import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyServiceLinkToClipboard = (serviceId) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(window.location.origin + '/service/' + serviceId)
    info('Ссылка на услугу скопирована в буфер обмена')
  }
}

export default useCopyServiceLinkToClipboard
