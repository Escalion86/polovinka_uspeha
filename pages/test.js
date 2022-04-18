// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import yandexCloud from '@helpers/yandexCloud'

// import { uploadFile } from 'react-s3'

import yandexCloud from '@helpers/yandexCloud'
// import S3 from 'react-aws-s3'

// var sha256hmac = require('js-sha256').hmac

// function getSignatureKey(key, dateStamp, regionName, serviceName) {
//   var kDate = sha256hmac('AWS4' + key, dateStamp)
//   var kRegion = sha256hmac(kDate, regionName)
//   var kService = sha256hmac(kRegion, serviceName)
//   var kSigning = sha256hmac(kService, 'aws4_request')

//   return kSigning
// }

const config = {
  bucketName: 'uniplatform',
  region: 'ru-central1',
  // accessKeyId: 'lxTG7EvumwEhr6pN5rYx',
  // secretAccessKey: 'pawb6iMjw3PLywqu0s9fQMjQbz6rLj6Wpgtihg1M',
  accessKeyId: 'MDBuAm058yFRAech1ZAC',
  secretAccessKey: 'L_enahHv6X3adoq0G-93INuVZhZB8YtmuPnUnUSZ',
}

// const config2 = {
//   bucketName: 'uniplatform',
//   // dirName: 'media' /* optional */,
//   region: 'ru-central1',
//   accessKeyId: 'lxTG7EvumwEhr6pN5rYx',
//   secretAccessKey:
//     'pawb6iMjw3PLywqu0s9fQMjQbz6rLj6Wpgtihg1M-3r98f373f=qwrq3rfr3rf',
//   s3Url: 'http://uniplatform.storage.yandexcloud.net/' /* optional */,
// }

// const ReactS3Client = new S3(config2)

const getFile = async (name) => {
  return await fetch(`https://storage.yandexcloud.net/uniplatform/${name}`, {
    method: 'GET',
    // mode: 'cors',

    // Authorization: signKey,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   // 'Content-Type': 'text/plain',
    //   'Content-Type': 'application/json',
    // },
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log('data of file', data)
      return data
    })
    .catch((err) => console.error('ERROR', err))
}

const deleteFile = async (name) => {
  // const key = 'pawb6iMjw3PLywqu0s9fQMjQbz6rLj6Wpgtihg1M'
  // const dateStamp = '20220302'
  // const regionName = 'us-east-1'
  // const serviceName = 's3'

  // ReactS3Client.deleteFile(name)
  //   .then((response) => console.log(response))
  //   .catch((err) => console.error(err))

  yandexCloud
    .deleteFile(name, config, 'yandex')
    .then((data) => console.log(data))
    .catch((err) => console.error(err))

  // const signKey = getSignatureKey(key, dateStamp, regionName, serviceName)
  // console.log('signKey', signKey)

  // return await fetch(
  //   `https://storage.yandexcloud.net/uniplatform/video_2021-12-28_12-41-15.mp4`,
  //   {
  //     method: 'DELETE',
  //     mode: 'cors',

  //     // Authorization: signKey,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       // 'Content-Type': 'text/plain',
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // )
  //   // .then((response) => response.json())
  //   .then((data) => {
  //     console.log('data of deleted file', data)
  //     return data
  //   })
  //   .catch((err) => console.error('ERROR', err))
}

const sendVideo = async (video) => {
  if (typeof video === 'object') {
    console.log('-------------------------------- send video')

    yandexCloud
      .uploadFile(video, config)
      .then((data) => console.log(data))
      .catch((err) => console.error(err))

    // const formData = new FormData()
    // formData.append('file', video)
    //   // formData.append('props', '12345')
    //   // console.log('video', video)
    //   // formData.append(
    //   //   'upload_preset',
    //   //   folder ? CLOUDINARY_FOLDER + '_' + folder : CLOUDINARY_FOLDER
    //   // )
    //   // if (videoName) {
    //   //   formData.append('public_id', videoName)
    //   // }

    //   return await fetch(
    //     'https://storage.yandexcloud.net/uniplatform/lectures/test',
    //     {
    //       method: 'PUT',
    //       body: formData,
    //       mode: 'cors',
    //       headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         // 'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //     .then((response) => {
    //       console.log('response', response)
    //       response.json()
    //     })
    //     .then((data) => {
    //       console.log('data of sended video file', data)
    //     })
    //     .catch((err) => console.error('ERROR', err))
    // } else {
    //   console.log('Это не видео файл')
  }
}

const Test = ({ user, error, success }) => {
  // const router = useRouter()

  // const checkList = async () => {
  //   var list = await yandexCloud.GetList('courses/')
  //   console.log('list', list)
  // }

  return (
    <div className="box-border w-screen h-screen overflow-hidden">
      <input
        type="file"
        onChange={(e) => sendVideo(e.target.files[0])}
        // accept="video/mp4,video/x-m4v,video/*"
        // accept="image/jpeg,image/png"
      />
      <button onClick={() => deleteFile('lectures/sneg-logo.png')}>
        Удалить
      </button>
      <button onClick={() => getFile('video_2021-12-28_12-41-15.mp4')}>
        Получить данные
      </button>
    </div>
  )
}

export default Test

// export const getServerSideProps = async (context) => {

//   if (!newUser)
//     return {
//       props: {
//         user: {
//           email,
//         },
//         error:
//           'Ошибка создания пользователя. Пожалуйста обратитесь к администратору',
//       },
//     }

//   // Теперь удаляем токен
//   await EmailConfirmations.deleteOne({ email, token })

//   return {
//     props: {
//       user: {
//         email: context.query.email,
//       },
//       success: 'Почта подтверждена!',
//     },
//   }
// }
