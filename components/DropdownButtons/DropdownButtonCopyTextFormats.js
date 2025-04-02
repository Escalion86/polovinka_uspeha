import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { faHtml5 } from '@fortawesome/free-brands-svg-icons/faHtml5'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import htmlToWhatsapp from '@helpers/htmlToWhatsapp'
import DropdownButton from '@components/DropdownButton'
import useCopyToClipboard from '@helpers/useCopyToClipboard'

const DropdownButtonCopyTextFormats = ({ text }) => {
  const copyResultHtml = useCopyToClipboard(
    text,
    'HTML скопирован в буфер обмена'
  )
  const copyResultWhatsapp = useCopyToClipboard(
    htmlToWhatsapp(text),
    'Текст для Whatsapp скопирован в буфер обмена'
  )

  return (
    <DropdownButton
      name="Скопировать сообщение"
      icon={faCopy}
      items={[
        {
          name: 'В формате Html',
          onClick: copyResultHtml,
          icon: faHtml5,
        },
        {
          name: 'В формате Whatsapp',
          onClick: copyResultWhatsapp,
          icon: faWhatsapp,
        },
      ]}
      disabled={!text}
    />
  )
}

export default DropdownButtonCopyTextFormats
