import BlockContainer from '@components/BlockContainer'
import { H2, H3 } from '@components/tags'

const PriceBlock = () => (
  <BlockContainer
    id="price"
    style={{
      backgroundImage: `url("/img/other/golden-cup-and-baske.webp")`,
      backgroundRepeat: 'no-repeat',
      // backgroundPosition: 'top 48px right',
      backgroundSize: 'cover',
    }}
  >
    <H2>Стоимость услуг</H2>
  </BlockContainer>
)

export default PriceBlock
