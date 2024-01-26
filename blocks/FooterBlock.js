import BlockContainer from '@components/BlockContainer'

const FooterBlock = () => {
  return (
    <BlockContainer
      extraSmall
      bgClassName="bg-general"
      childrenWrapperClassName="flex justify-center w-full text-white"
    >
      <a
        href="/docs/politika.docx"
        className="duration-300 hover:text-green-400"
        download
      >
        Политика конфиденциальности
      </a>
    </BlockContainer>
  )
}

export default FooterBlock
