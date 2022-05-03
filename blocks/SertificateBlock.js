import DirectionBlock from './DirectionBlock'

const SertificateBlock = ({ sertificate, inverse }) => {
  if (!sertificate) return null
  return (
    <DirectionBlock
      image={sertificate.image}
      title={sertificate.title}
      description={sertificate.description}
      inverse={inverse}
      id="sertificate"
    />
  )
}

export default SertificateBlock
