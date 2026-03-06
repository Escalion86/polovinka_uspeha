import isObject from './isObject'

// export const deleteImage = async (publicId, resource_type = 'image') => {
//   try {
//     const res = await fetch('/api/cloudimages', {
//       method: 'DELETE',
//       // headers: {
//       //   Accept: contentType,
//       //   'Content-Type': contentType,
//       // },
//       body: JSON.stringify({ publicId, resource_type }),
//     })

//     // Throw error with status code in case Fetch API req failed
//     if (!res.ok) {
//       throw new Error(res.status)
//     }
//   } catch (error) {
//     // setMessage('Failed to update on ' + url)
//   }
// }

// export const deleteImages = async (arrayOfImagesUrls, callback = null) => {
//   // if (arrayOfImagesUrls.length > 0)
//   //   await Promise.all(
//   //     arrayOfImagesUrls.map(async (imageUrl) => {
//   //       if (imageUrl.lastIndexOf(CLOUDINARY_FOLDER + '/') > 0) {
//   //         await deleteImage(
//   //           imageUrl.substring(
//   //             imageUrl.lastIndexOf(CLOUDINARY_FOLDER + '/'),
//   //             imageUrl.lastIndexOf('.')
//   //           )
//   //         )
//   //       } else if (!imageUrl.includes('https://res.cloudinary.com')) {
//   //         await deleteImage(CLOUDINARY_FOLDER + '/' + imageUrl)
//   //       }
//   //     })
//   //   )
//   if (callback) callback()
// }

// export const getImages = async (
//   directory,
//   callback,
//   project = 'polovinka_uspeha'
// ) => {
//   if (directory) {
//     const query = {
//       directory,
//     }

//     const queryString = new URLSearchParams(query).toString()
//     const urlWithQuery = `https://api.escalioncloud.ru/api/files?${project}/${queryString}`

//     return await fetch(
//       // 'https://api.cloudinary.com/v1_1/escalion-ru/image/upload',
//       urlWithQuery,
//       {
//         method: 'GET',
//         // body: formData,
//         //  JSON.stringify({
//         //   file: image,
//         //   fileName: imageName ?? 'test.jpg',
//         //   folder: 'events',
//         // })
//         // dataType: 'json',
//         // headers: {
//         //   'Content-Type': 'application/json',
//         // 'Content-Type': "multipart/form-data"
//         // },
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('data', data)
//         // if (data.secure_url !== '') {
//         // if (callback) callback(data.secure_url)
//         // return data.secure_url
//         // }
//         if (callback) callback(data)
//         return data
//       })
//       .catch((err) => console.error('ERROR', err))
//   }
// }

export const sendImage = async (
  image,
  callback,
  folder,
  imageName = null,
  project = 'polovinka_uspeha',
  onError = null
) => {
  if (isObject(image)) {
    const formData = new FormData()
    const normalizedProject =
      typeof project === 'string' ? project.trim() : String(project || '').trim()
    const normalizedFolder =
      typeof folder === 'string' ? folder.trim() : String(folder || '').trim()
    const directoryPath = `${normalizedProject || 'polovinka_uspeha'}/${normalizedFolder || 'temp'}`

    formData.append('directory', directoryPath)
    formData.append('files', image)
    if (imageName) formData.append('fileName', imageName)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      const response = await fetch('/api/escalioncloud', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })
      clearTimeout(timeoutId)

      const rawResponse = await response.text()
      let responseJson = null
      try {
        responseJson = rawResponse ? JSON.parse(rawResponse) : null
      } catch {
        responseJson = null
      }

      if (!responseJson) {
        const contentType = response.headers.get('content-type') || ''
        const trimmedResponse = rawResponse?.trim?.() || ''
        console.error('Upload returned non-JSON response', {
          status: response.status,
          ok: response.ok,
          contentType,
          preview: trimmedResponse.slice(0, 200),
        })
        const isHtmlResponse =
          contentType.includes('text/html') ||
          trimmedResponse.startsWith('<!doctype') ||
          trimmedResponse.startsWith('<html') ||
          trimmedResponse.startsWith('<')

        if (isHtmlResponse) {
          if (response.status === 413) {
            if (onError)
              onError(
                'Файл слишком большой для загрузки. Попробуйте фото меньшего размера.'
              )
            return null
          }
          if (onError)
            onError(
              `Сервер вернул HTML вместо JSON (status ${response.status}).`
            )
          return null
        }

        if (onError)
          onError('Сервер вернул некорректный ответ при загрузке файла.')
        return null
      }

      console.log('data', responseJson)

      if (!response.ok || !responseJson?.success) {
        const error =
          responseJson?.data?.error?.message || `Upload failed: ${response.status}`
        if (onError) onError(error)
        return null
      }

      const data = responseJson.data
      if (callback) callback(data)
      return data
    } catch (err) {
      const message =
        err?.name === 'AbortError'
          ? 'Upload timeout'
          : err?.message || 'Upload failed'
      console.error('ERROR', err)
      if (onError) onError(message)
      return null
    }
  }
  if (onError) onError('Image is invalid')
  return null
}

// const sendFile = async (
//   file,
//   callback,
//   folder,
//   fileName = null,
//   project = 'polovinka_uspeha'
// ) => {
//   if (isObject(file)) {
//     const formData = new FormData()
//     formData.append('project', project ?? 'polovinka_uspeha')

//     formData.append('folder', folder ?? 'temp')
//     // formData.append('password', 'cloudtest')
//     formData.append('fileType', 'file')
//     formData.append('files', file)
//     formData.append('fileName', fileName)

//     return await fetch(
//       // 'https://api.cloudinary.com/v1_1/escalion-ru/image/upload',
//       'https://api.escalioncloud.ru/api',
//       {
//         method: 'POST',
//         body: formData,
//         //  JSON.stringify({
//         //   file: image,
//         //   fileName: imageName ?? 'test.jpg',
//         //   folder: 'events',
//         // })
//         // dataType: 'json',
//         // headers: {
//         //   'Content-Type': 'application/json',
//         // 'Content-Type': "multipart/form-data"
//         // },
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('data', data)
//         // if (data.secure_url !== '') {
//         // if (callback) callback(data.secure_url)
//         // return data.secure_url
//         // }
//         if (callback) callback(data)
//         return data
//       })
//       .catch((err) => console.error('ERROR', err))
//   }
// }

// export const sendVideo = async (
//   video,
//   callback,
//   folder = null,
//   videoName = null
// ) => {
//   if (isObject(video)) {
//     const formData = new FormData()
//     formData.append('file', video)
//     formData.append(
//       'upload_preset',
//       folder ? CLOUDINARY_FOLDER + '_' + folder : CLOUDINARY_FOLDER
//     )
//     if (videoName) {
//       formData.append('public_id', videoName)
//     }

//     return await fetch(
//       'https://api.cloudinary.com/v1_1/escalion-ru/video/upload',
//       {
//         method: 'POST',
//         body: formData,
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.secure_url !== '') {
//           if (callback) callback(data.secure_url)
//           return data.secure_url
//         }
//       })
//       .catch((err) => console.error('ERROR', err))
//   }
// }

// export const deleteVideo = async (publicId, resource_type = 'video') => {
//   // const { id } = router.query

//   try {
//     const res = await fetch('/api/cloudimages', {
//       method: 'DELETE',
//       // headers: {
//       //   Accept: contentType,
//       //   'Content-Type': contentType,
//       // },
//       body: JSON.stringify({ publicId, resource_type }),
//     })

//     if (!res.ok) {
//       throw new Error(res.status)
//     }
//     return res
//   } catch (error) {
//     return error
//     // setMessage('Failed to update on ' + url)
//   }
// }
