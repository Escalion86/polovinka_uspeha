import BlockContainer from '@components/BlockContainer'
import { H3 } from '@components/tags'

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

const ContactsBlock = () => (
  <BlockContainer id="contacts" small>
    <H3>Контакты</H3>
    <div className="flex w-full justify-evenly">
      <ContactImage
        src="/img/contacts/intagram.webp"
        href="https://www.instagram.com/polovinka.krsk/"
      />
      <ContactImage
        src="/img/contacts/telegram.webp"
        href="https://t.me/polovinkakrsk"
      />
      <ContactImage
        src="/img/contacts/vk.webp"
        href="https://vk.com/polovinka.krsk"
      />
      <ContactImage
        src="/img/contacts/whatsapp.webp"
        href="https://wa.me/79504280891"
      />
    </div>
  </BlockContainer>
)

export default ContactsBlock
