import copyToClipboard from './copyToClipboard'
import useSnackbar from './useSnackbar'

const useCopyServiceLinkToClipboard = (location, serviceId) => {
  const { info } = useSnackbar()

  return () => {
    copyToClipboard(
      window.location.origin + '/' + location + '/service/' + serviceId
    )
    info('Ссылка на услугу скопирована в буфер обмена')
  }
}

export default useCopyServiceLinkToClipboard
