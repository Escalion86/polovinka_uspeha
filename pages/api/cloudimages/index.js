import cloudinary from 'cloudinary'

export default async function handler(req, res) {
  const { method } = req

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

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
        cloudinary.v2.uploader.destroy(
          publicId,
          { resource_type },
          (error, result) => console.log(result, error)
        )
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
