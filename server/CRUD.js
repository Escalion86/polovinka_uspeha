import dbConnect from '@utils/dbConnect'

export default async function handler(Schema, req, res, params = null) {
  // FIX
  // const session = await getSession({ req })
  // if (!session || !session.user._id)
  //   return res?.status(400).json({ success: false })

  const { query, method, body } = req

  const id = query?.id

  // console.log(`session.user`, session.user)

  await dbConnect()

  let data
  console.log('Schema', Schema)
  console.log(`method`, method)
  console.log(`params`, params)
  console.log(`id`, id)
  console.log(`body`, body)

  switch (method) {
    case 'GET':
      try {
        if (params) {
          data = await Schema.find(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          data = await Schema.findById(id)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          data = await Schema.find()
          return res?.status(200).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'POST':
      try {
        if (id) {
          return res
            ?.status(400)
            .json({ success: false, error: 'No need to set Id' })
        } else {
          const clearedBody = { ...body }
          delete clearedBody._id
          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          return res?.status(201).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'PUT':
      try {
        if (id) {
          data = await Schema.findById(id)
          if (!data) {
            return res?.status(400).json({ success: false })
          } else
            data = await Schema.findByIdAndUpdate(id, body, {
              new: true,
              runValidators: true,
            })
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false, error: 'No Id' })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        if (params) {
          data = await Schema.deleteMany(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
          // return data
        } else if (id) {
          data = await Schema.findById(id)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          data = await Schema.deleteOne({
            _id: id,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          // Добавляем уведомление об удалении
          // FIX
          // if (Schema === Products || Schema === Sets)
          //   await Notifications.create({
          //     responsibleUserId: session.user._id,
          //     dbName: dbNameFromSchema(Schema),
          //     itemId: id,
          //     oldItem: prepareData(oldData),
          //     newItem: null,
          //     status: 'delete',
          //   })
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          data = await Schema.deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    default:
      return res?.status(400).json({ success: false })
      break
  }
}
