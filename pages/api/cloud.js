import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
}

const readFile = async (req, options) => {
  const form = formidable(options)
  return new Promise((resolve, reject) => {
    // if (!fs.existsSync(tempDir))
    //   fs.mkdirSync(tempDir, { recursive: true }, (err) => {
    //     resolve({ success: false })
    //   })

    form.parse(req, (err, fields, files) => {
      console.log('err', err)
      if (err) reject(err)
      console.log('files', files)
      console.log('fields', fields)

      // var dir = path.join('cloud', fields.project, fields.directory)
      // const serverDir = path.join(process.cwd(), 'public', dir)
      // if (!fs.existsSync(serverDir))
      //   fs.mkdirSync(serverDir, { recursive: true }, (err) => {
      //     resolve({ success: false })
      //   })

      // const url =
      //   req.headers.origin +
      //   '/' +
      //   path.join(dir, files.file.newFilename).replace(/\\/g, '/')

      // Move file
      // fs.rename(
      //   files.file.filepath,
      //   path.join(serverDir, files.file.newFilename),
      //   function (err) {
      //     if (err) throw err
      //   }
      // )

      resolve(true)
    })
  })
}

const handler = async (req, res) => {
  const { query, method, body } = req

  console.log('req', Object.keys(req))

  var dir = path.join('cloud', 'temp')
  var url = req.headers.origin + '/' + dir.replace(/\\/g, '/')
  // const tempDir = path.join(process.cwd(), '/temp')

  // if (!fs.existsSync(tempDir))
  //   fs.mkdirSync(tempDir, { recursive: true }, (err) => {
  //     res?.status(400).json({ error: "Can't edit temp dir" })
  //   })

  console.log('dir1', dir)
  console.log('url1', url)

  // const form = formidable()
  // await new Promise((resolve, reject) => {
  //   form.parse(req, (err, fields, files) => {
  //     if (err) reject(err)

  //     dir = path.join('cloud', fields.project, fields.directory)
  //     url =
  //       req.headers.origin +
  //       '/' +
  //       path.join(dir, files.file.originalFilename).replace(/\\/g, '/')
  //     resolve(true)
  //   })
  // })

  console.log('dir', dir)
  console.log('url', url)

  const uploadDir = path.join(process.cwd(), 'public', dir)
  if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true }, (err) => {
      resolve({ success: false })
    })

  console.log('uploadDir', uploadDir)

  const options = {
    uploadDir,
    filename: (name, ext, path, form) => {
      return path.originalFilename
      // return Date.now().toString() + '_' + path.originalFilename
    },
    // maxFileSize: 4000 * 1024 * 1024
  }
  const data = ''
  // const data = await readFile(req, options)
  // console.log('data', data)
  if (data === true)
    return res?.status(200).json({
      status: true,
      data: url,
    })
  else
    return res?.status(400).json({
      status: false,
      error: "Can't save file",
    })

  // const data = await new Promise((resolve, reject) => {
  //   const options = {
  //     uploadDir: path.join(process.cwd()),
  //     filename: (name, ext, path, form) => {
  //       return Date.now().toString() + '_' + path.originalFilename
  //     },
  //     // maxFileSize: 4000 * 1024 * 1024
  //   }

  //   const form = formidable(options)

  //   form.parse(req, (err, fields, files) => {
  //     if (err) reject({ err })

  //     // var dir = path.join(fields.project, fields.directory)
  //     // const serverDir = path.join(process.cwd(), dir)

  //     // console.log('serverDir', serverDir)

  //     // // console.log('x', x)
  //     // // console.log('req.headers', req.headers)
  //     // console.log(1)
  //     // if (!fs.existsSync(serverDir)) {
  //     //   fs.mkdirSync(serverDir, { recursive: true })
  //     // }
  //     // console.log('files', files)
  //     // // fs.writeFile(
  //     // //   path.join(serverDir, files.file.originalFilename),
  //     // //   files.file,
  //     // //   function (err) {
  //     // //     if (err) {
  //     // //       return console.log(err)
  //     // //     }
  //     // //     console.log('The file was saved!')
  //     // //   }
  //     // // )
  //     // const clientPath = path.join(
  //     //   req.headers.origin,
  //     //   dir,
  //     //   files.file.originalFilename
  //     // )
  //     // console.log('clientPath', clientPath)
  //     // resolve(clientPath)
  //     resolve({ fields, files })
  //   })
  // })

  // //return the data back or just do whatever you want with it
  // res.status(200).json({
  //   status: 'ok',
  //   data,
  // })
}

// export default async function handler(req, res) {
//   switch (req.method) {
//     case 'POST': {
//       let form = new multiparty.Form()
//       let FormResp = await new Promise((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//           if (err) reject(err)
//           resolve({ fields, files })
//         })
//       })
//       const { fields, files } = FormResp
//       req.body = fields
//       req.files = files
//       await addContact(req, res)
//     }
//   }
// }

// const fs = require('fs')
// var querystring = require('querystring')
// const express = require('express')
// const formidable = require('formidable')
// var multer = require('multer')
// var upload = multer()

// const cors = require('cors')

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// app.use(
//   cors({
//     origin: true,
//   })
// )

// app.use(upload.array())
// app.use(express.static('public'))

// app.post('/api/user', function (req, res) {
//   console.log(req.body)
//   console.log(req.body.username)
// })

// // app.post('/up', (req, res) => {
// //   const form = formidable({ multiples: true })
// //   form.parse(req, (err, fields, files) => {
// //     console.log('fields: ', fields)
// //     console.log('files: ', files)
// //     res.send({ success: true })
// //   })
// // })

// // function parseBody(req, callback) {
// //   var body = ''
// //   req.on('data', (data) => {
// //     console.log('1')
// //     return (body += data)
// //   })
// //   req.on('end', () => callback(querystring.parse(body)))
// //   req.on('error', function (e) {
// //     console.log('e', e)
// //   })
// // }

// // export default async function handler(req, res) {
// //   const { query, method, body } = req

// //   // await dbConnect()
// //   if (method === 'POST') {
// //     try {
// //       // const { email, password } = body
// //       // console.log('body', body)
// //       // console.log('!')
// //       // parseBody(req, function (data) {
// //       //   console.log(data)
// //       // })

// //       // var json = ''
// //       // req.on('data', function (chunk) {
// //       //   json += chunk.toString('utf8')
// //       // })
// //       // req.on('end', function () {
// //       //   console.log(json)
// //       //   var jsonObj = JSON.parse(json)
// //       //   console.log(jsonObj.task)
// //       // })

// //       // var body = ''

// //       // res.on('data', function (chunk) {
// //       //   body += chunk
// //       // })

// //       // res.on('end', function () {
// //       //   var fbResponse = JSON.parse(body)
// //       //   for (const pair of fbResponse.entries()) {
// //       //     console.log(`${pair[0]}, ${pair[1]}`)
// //       //   }
// //       // })

// //       // fs.writeFile(
// //       //   body.folder + '/' + body.fileName,
// //       //   body.file,
// //       //   function (err) {
// //       //     if (err) {
// //       //       return console.log(err)
// //       //     }
// //       //     console.log('The file was saved!')
// //       //   }
// //       // )

// //       return res?.status(201).json({ success: true, data: '!' })
// //     } catch (error) {
// //       console.log(error)
// //       return res?.status(400).json({ success: false, error })
// //     }
// //   }

// //   // if (method === 'GET') {
// //   //   const { email, token } = query
// //   //   if (!email)
// //   //     return res
// //   //       ?.status(400)
// //   //       .json({ success: false, error: 'Отсутствует email' })
// //   //   if (!token)
// //   //     return res
// //   //       ?.status(400)
// //   //       .json({ success: false, error: 'Отсутствует токен' })
// //   //   try {
// //   //     const data = await EmailConfirmations.findOne({ email, token })
// //   //     if (!data) {
// //   //       return res
// //   //         ?.status(400)
// //   //         .json({ success: false, error: 'Нет данных по токену' })
// //   //     }
// //   //     const newUser = await Users.create({
// //   //       email,
// //   //       password: data.password,
// //   //       name: '',
// //   //     })
// //   //     if (!newUser)
// //   //       return res
// //   //         ?.status(400)
// //   //         .json({ success: false, error: 'Не удалось создать пользователя' })

// //   //     return res?.status(201).json({ success: true, data: newUser })
// //   //   } catch (error) {
// //   //     console.log(error)
// //   //     return res?.status(400).json({ success: false, error })
// //   //   }
// //   // }
// // }
export default handler
