import { LOCATIONS_KEYS_VISIBLE } from '@helpers/constants'

import dbConnect from '@utils/dbConnect'
import mongoose from 'mongoose'

const query = {
  // collection: 'events',
  // select: 'title,dateStart,dateEnd,status',
  _id: {
    $in: [
      '63e366408eada61cda620a49',
      '63db52068eada61cda616b38',
      '641bafbc397916ec8cc58d12',
      '63e3690e8eada61cda620a6d',
      '6417fe01b5eb09b59e090645',
      '63e3655c8eada61cda620a27',
      '64269546fe6ab27e974ad01f',
      '641922e4a8d78321ea8c7330',
      '642aea130b2387547bf5f311',
      '642adc1c0b2387547bf5eb15',
      '641ac383397916ec8cc576e7',
      '643cc6daf798857df4e841e7',
      '642e790565aee29391b652c1',
      '6437d6eaea4169661b2e81fb',
      '6440a0fbbfa971f697d007bf',
      '64425c55c46e2094ceefd08a',
      '6455412213b8c4899b04f3a2',
      '6450c4062ccf4172cec2901a',
      '645e394774f58b122c27c67d',
      '646b17907ea4387fee169d01',
      '646b018d7ea4387fee169ae2',
      '646d9bf77ea4387fee16efbb',
      '6445f6fcc46e2094cef00439',
      '646afe4c7ea4387fee169a94',
      '6462392a74f58b122c281e78',
      '6480943d8a98e41e0134dc12',
      '645e314274f58b122c27c385',
      '64baa9a13b1bebdb47443c93',
      '64d1e1e588214bc3837c5cf9',
      '64d44eea88214bc3837cb625',
      '650e4fa927ddbec1cb74554f',
      '6510f7984a07770003774025',
      '6510fe6e6e00ff5b7f862cc8',
      '6518e0c8991c9d77de342325',
      '65253eb0b68caf7c64d1fefb',
      '65143ea2b948663f15290a1d',
      '652e003f276e0551c4792dca',
      '653951c9b6c315c64541a273',
      '653b74cd96f332d692c9c480',
      '654bb2109037f35e04e96ff1',
      '6555961f038d2c2fca20ec2b',
      '6555a4ad038d2c2fca20f0db',
      '657d35fef6d0a6302acd9dc6',
      '657d3ed9f6d0a6302acd9e4e',
      '65d0b4c5cb2e41687b9cb86d',
      '65d1dc6ecb2e41687b9ce691',
      '65fe43adbabea92c1fc37339',
      '660bb6a78ea434ad6dff40ac',
      '6623631556da915158461cd9',
      '668cf9188866d7e6cf300e18',
      '66c5ca18815cda48a436f5c7',
      '66c5cffa815cda48a436f661',
      '66c5b889815cda48a436f3c9',
      '66e6a27188e989dd93f57f04',
      '670a58e7d6ff69ec88c81117',
      '6707a156d6ff69ec88c7ae18',
      '6767c5b63d6aaea8b142f862',
      '67cee5c91db9d968fdd9e389',
      '6800bdb28b32e34e0c8c5841',
      '6800c7898b32e34e0c8c6e98',
    ],
  },
  blank: false,
  // sort: 'dateStart',
}

function convertQuery(query) {
  const converted = {}
  for (const key in query) {
    let value = query[key]
    if (key === '_id') {
      converted[key] = processIdValue(value)
    } else if (
      ['dateStart', 'dateEnd', 'createdAt', 'updatedAt'].includes(key)
    ) {
      converted[key] = processDateValue(value)
    } else {
      converted[key] = value
    }
  }
  return converted
}

function processIdValue(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const processed = {}
    for (const op in value) {
      const opValue = value[op]
      if (op === '$in' && Array.isArray(opValue)) {
        processed[op] = opValue.map((id) => new mongoose.Types.ObjectId(id))
      } else if (typeof opValue === 'object' && opValue !== null) {
        processed[op] = processIdValue(opValue)
      } else {
        processed[op] = new mongoose.Types.ObjectId(opValue)
      }
    }
    return processed
  } else {
    return new mongoose.Types.ObjectId(value)
  }
}

function processDateValue(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const processed = {}
    for (const op in value) {
      processed[op] = new Date(value[op])
    }
    return processed
  } else {
    return new Date(value)
  }
}

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    const db = await dbConnect('krsk')

    if (!db) return res?.status(400).json({ success: false, error: 'db error' })

    console.log('convertQuery(query) :>> ', convertQuery(query))

    const test = await db.model('Events').find(convertQuery(query)).lean()

    console.log('test :>> ', test)

    return res?.status(201).json({
      success: true,
      data: test,
    })
  }
  return res?.status(400).json({ success: false, error: 'wrong method' })
}
