import DirectionBlock from './DirectionBlock'

const SertificatBlock = ({ sertificat, inverse }) => (
  <DirectionBlock
    image={sertificat.image}
    title={sertificat.title}
    description={sertificat.description}
    inverse={inverse}
    id="sertificat"
  />
)

export default SertificatBlock
