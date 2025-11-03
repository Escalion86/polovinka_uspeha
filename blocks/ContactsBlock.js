import { useAtomValue } from 'jotai'

import BlockContainer from '@components/BlockContainer'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import Image from 'next/image'

const CONTACT_IMAGE_DIMENSIONS = {
  '/img/contacts/phone.png': { width: 280, height: 280 },
  '/img/contacts/intagram.webp': { width: 97, height: 97 },
  '/img/contacts/telegram.webp': { width: 2048, height: 2048 },
  '/img/contacts/vk.png': { width: 512, height: 512 },
  '/img/contacts/whatsapp.webp': { width: 88, height: 88 },
  '/img/contacts/viber.png': { width: 485, height: 485 },
  '/img/contacts/email.png': { width: 837, height: 837 },
}

const ContactImage = ({ src, href, alt }) => {
  const { width, height } = CONTACT_IMAGE_DIMENSIONS[src] || {
    width: 128,
    height: 128,
  }

  return (
    <a href={href} className="duration-300 hover:scale-125">
      <Image
        className="object-cover w-12 h-12 tablet:w-24 tablet:h-24"
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 6rem, 3rem"
      />
    </a>
  )
}

const ContactsBlock = () => {
  const siteSettings = useAtomValue(siteSettingsAtom)

  return (
    <BlockContainer id="contacts" small title="Контакты">
      <div className="flex w-full justify-evenly">
        {siteSettings?.phone && (
          <ContactImage
            src="/img/contacts/phone.png"
            href={'tel:' + siteSettings.phone}
            alt="Позвонить"
          />
        )}
        {siteSettings?.instagram && (
          <ContactImage
            src="/img/contacts/intagram.webp"
            href={'https://www.instagram.com/' + siteSettings.instagram}
            alt="Перейти в Instagram"
          />
        )}
        {siteSettings?.telegram && (
          <ContactImage
            src="/img/contacts/telegram.webp"
            href={'https://t.me/' + siteSettings.telegram}
            alt="Написать в Telegram"
          />
        )}
        {siteSettings?.vk && (
          <ContactImage
            src="/img/contacts/vk.png"
            href={'https://vk.com/' + siteSettings.vk}
            alt="Перейти во ВКонтакте"
          />
        )}
        {siteSettings?.whatsapp && (
          <ContactImage
            src="/img/contacts/whatsapp.webp"
            href={
              'https://api.whatsapp.com/send?phone=' + siteSettings?.whatsapp
            }
            alt="Написать в WhatsApp"
          />
        )}
        {siteSettings?.viber && (
          <ContactImage
            src="/img/contacts/viber.png"
            href={'viber://chat?number=' + siteSettings?.viber}
            alt="Написать в Viber"
          />
        )}
        {siteSettings?.email && (
          <ContactImage
            src="/img/contacts/email.png"
            href={'mailto:' + siteSettings?.email}
            alt="Отправить письмо"
          />
        )}
      </div>
    </BlockContainer>
  )
}

export default ContactsBlock
