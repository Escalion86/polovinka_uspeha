// import cloudinary from 'cloudinary'

import Client, { Server } from 'nextcloud-node-client'

export default async function handler(req, res) {
  const { method } = req

  const server = new Server({
    basicAuth: {
      password: process.env.NEXTCLOUD_PASSWORD,
      username: process.env.NEXTCLOUD_USERNAME,
    },
    url: process.env.NEXTCLOUD_URL,
  })

  const client = new Client(server)

  const folder = await client.getFolder('/Photos')
  const files = await folder.getFiles()
  const file = await client.getFile('/Photos/DSC01546.jpg')

  const createShare = { fileSystemElement: file }
  const share = await client.createShare(createShare)
  const shareLink = share.url

  // console.log('folder', folder)
  // console.log('files', files)

  // return

  res.status(200).json({ success: true, data: { file, shareLink } })
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // })

  switch (method) {
    // case 'POST':
    //   try {
    //     const product = await Products.create(
    //       req.body
    //     ) /* create a new model in the database */
    //     res.status(201).json({ success: true, data: product })
    //   } catch (error) {
    //     res.status(400).json({ success: false })
    //   }
    //   break
    case 'DELETE' /* Delete a model by its ID */:
      try {
        const { publicId, resource_type } = JSON.parse(req.body)
        console.log('publicId', publicId)
        // cloudinary.v2.uploader.destroy(
        //   publicId,
        //   { resource_type },
        //   (error, result) => console.log(result, error)
        // )
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false, error })
        console.log(`error`, error)
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
