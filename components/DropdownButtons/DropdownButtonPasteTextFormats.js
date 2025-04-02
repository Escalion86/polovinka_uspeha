import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { faHtml5 } from '@fortawesome/free-brands-svg-icons/faHtml5'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import DropdownButton from '@components/DropdownButton'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import convertWhatsappToHtml from '@helpers/convertWhatsappToHtml'

const DropdownButtonPasteTextFormats = ({ onSelect }) => {
  return (
    <DropdownButton
      name="Вставить текст"
      icon={faPaste}
      items={[
        {
          name: 'Html из буфера',
          onClick: async () => {
            if (typeof onSelect === 'function')
              await pasteFromClipboard(onSelect)
          },
          icon: faHtml5,
        },
        {
          name: 'Скопированный из Whatsapp',
          onClick: async () => {
            if (typeof onSelect === 'function')
              await pasteFromClipboard((text) => {
                const prepearedText = convertWhatsappToHtml(text)
                onSelect(prepearedText)
              })
          },
          icon: faWhatsapp,
        },
      ]}
    />
  )
}

export default DropdownButtonPasteTextFormats
