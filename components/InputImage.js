import InputImages from './InputImages'

const InputImage = ({ image, onChange, ...props }) => {
  const onChangeFunc = (images) => {
    if (typeof onChange === 'function')
      onChange(images.length > 0 ? images[0] : null)
  }

  return (
    <InputImages
      images={image ? [image] : []}
      maxImages={1}
      onChange={onChangeFunc}
      {...props}
    />
  )
}

export default InputImage
