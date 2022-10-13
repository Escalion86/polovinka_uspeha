import Resizer from 'react-image-file-resizer'

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1000,
      1000,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri)
      },
      'blob'
    )
  })

export default resizeFile
