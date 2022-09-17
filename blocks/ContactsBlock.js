import BlockContainer from '@components/BlockContainer'
import { H2, H3 } from '@components/tags'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useRecoilValue } from 'recoil'

const ContactImage = ({ src, href }) => (
  <a href={href} className="duration-300 hover:scale-125">
    <img
      className="object-cover w-12 h-12 tablet:w-24 tablet:h-24"
      src={src}
      alt="contact"
      // width={48}
      // height={48}
    />
  </a>
)

const ContactsBlock = () => {
  const siteSettings = useRecoilValue(siteSettingsAtom)

  return (
    <BlockContainer id="contacts" small title="Контакты">
      <div className="flex w-full justify-evenly">
        {siteSettings?.phone && (
          <ContactImage
            src="/img/contacts/phone.png"
            href={'tel:' + siteSettings.phone}
          />
        )}
        {siteSettings?.instagram && (
          <ContactImage
            src="/img/contacts/intagram.webp"
            href={'https://www.instagram.com/' + siteSettings.instagram}
          />
        )}
        {siteSettings?.telegram && (
          <ContactImage
            src="/img/contacts/telegram.webp"
            href={'https://t.me/' + siteSettings.telegram}
          />
        )}
        {siteSettings?.vk && (
          <ContactImage
            src="/img/contacts/vk.png"
            href={'https://vk.com/' + siteSettings.vk}
          />
        )}
        {siteSettings?.whatsapp && (
          <ContactImage
            src="/img/contacts/whatsapp.webp"
            // href={'https://wa.me/' + siteSettings?.whatsapp}
            href={
              'https://api.whatsapp.com/send?phone=' + siteSettings?.whatsapp
            }
          />
        )}
        {siteSettings?.viber && (
          <ContactImage
            src="/img/contacts/viber.png"
            href={'viber://chat?number=' + siteSettings?.viber}
          />
        )}
        {siteSettings?.email && (
          <ContactImage
            src="/img/contacts/email.png"
            href={'mailto:' + siteSettings?.email}
          />
        )}
      </div>
    </BlockContainer>
  )
}

export default ContactsBlock
