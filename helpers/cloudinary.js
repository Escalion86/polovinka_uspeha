import { CLOUDINARY_FOLDER } from './constants'
import isObject from './isObject'

export const deleteImage = async (publicId, resource_type = 'image') => {
  try {
    const res = await fetch('/api/cloudimages', {
      method: 'DELETE',
      // headers: {
      //   Accept: contentType,
      //   'Content-Type': contentType,
      // },
      body: JSON.stringify({ publicId, resource_type }),
    })

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      throw new Error(res.status)
    }
  } catch (error) {
    // setMessage('Failed to update on ' + url)
  }
}

// TODO Adding delete not used images
export const deleteImages = async (arrayOfImagesUrls, callback = null) => {
  // if (arrayOfImagesUrls.length > 0)
  //   await Promise.all(
  //     arrayOfImagesUrls.map(async (imageUrl) => {
  //       if (imageUrl.lastIndexOf(CLOUDINARY_FOLDER + '/') > 0) {
  //         await deleteImage(
  //           imageUrl.substring(
  //             imageUrl.lastIndexOf(CLOUDINARY_FOLDER + '/'),
  //             imageUrl.lastIndexOf('.')
  //           )
  //         )
  //       } else if (!imageUrl.includes('https://res.cloudinary.com')) {
  //         await deleteImage(CLOUDINARY_FOLDER + '/' + imageUrl)
  //       }
  //     })
  //   )
  if (callback) callback()
}

export const sendImage = async (
  image,
  callback,
  folder = null,
  imageName = null,
  project = 'polovinka_uspeha'
) => {
  if (isObject(image)) {
    const formData = new FormData()
    // console.log('folder', folder)
    formData.append('project', project)
    formData.append('folder', folder)
    // formData.append('password', 'cloudtest')
    formData.append('files', image)

    return await fetch(
      // 'https://api.cloudinary.com/v1_1/escalion-ru/image/upload',
      'https://api.escalioncloud.ru/api',
      {
        method: 'POST',
        body: formData,
        //  JSON.stringify({
        //   file: image,
        //   fileName: imageName ?? 'test.jpg',
        //   folder: 'events',
        // })
        // dataType: 'json',
        // headers: {
        //   'Content-Type': 'application/json',
        // 'Content-Type': "multipart/form-data"
        // },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        // if (data.secure_url !== '') {
        // if (callback) callback(data.secure_url)
        // return data.secure_url
        // }
        if (callback) callback(data)
      })
      .catch((err) => console.error('ERROR', err))
  }
}

export const sendVideo = async (
  video,
  callback,
  folder = null,
  videoName = null
) => {
  if (isObject(video)) {
    const formData = new FormData()
    formData.append('file', video)
    formData.append(
      'upload_preset',
      folder ? CLOUDINARY_FOLDER + '_' + folder : CLOUDINARY_FOLDER
    )
    if (videoName) {
      formData.append('public_id', videoName)
    }

    return await fetch(
      'https://api.cloudinary.com/v1_1/escalion-ru/video/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url !== '') {
          if (callback) callback(data.secure_url)
          return data.secure_url
        }
      })
      .catch((err) => console.error('ERROR', err))
  }
}

export const deleteVideo = async (publicId, resource_type = 'video') => {
  // const { id } = router.query

  try {
    const res = await fetch('/api/cloudimages', {
      method: 'DELETE',
      // headers: {
      //   Accept: contentType,
      //   'Content-Type': contentType,
      // },
      body: JSON.stringify({ publicId, resource_type }),
    })

    if (!res.ok) {
      throw new Error(res.status)
    }
    return res
  } catch (error) {
    return error
    // setMessage('Failed to update on ' + url)
  }
}
