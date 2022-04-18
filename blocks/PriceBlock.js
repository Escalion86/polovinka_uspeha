import BlockContainer from '@components/BlockContainer'
import { H3 } from '@components/tags'

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
    <H3>Стоимость услуг</H3>
  </BlockContainer>
)

export default PriceBlock
