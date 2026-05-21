import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import { normalizePhoneValue } from '@helpers/phoneUtils'

const isValidPhone = (phone) => /^7\d{10}$/.test(String(phone || ''))

const getUserLabel = (user) => {
  const name = [user?.firstName, user?.secondName].filter(Boolean).join(' ').trim()
  return name || '[без имени]'
}

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res?.status(405).json({
      success: false,
      data: {
        error: {
          type: 'method_not_allowed',
          message: `Method ${method} Not Allowed`,
        },
      },
    })
  }

  if (!location || !checkLocationValid(location)) {
    return res?.status(400).json({
      success: false,
      data: {
        error: {
          type: 'invalid_location',
          message: 'Invalid location',
        },
      },
    })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({
        success: false,
        data: {
          error: {
            type: 'db_error',
            message: 'db error',
          },
        },
      })
    }

    const users = await db
      .model('Users')
      .find(
        { phone: { $ne: null } },
        {
          _id: 1,
          firstName: 1,
          secondName: 1,
          thirdName: 1,
          phone: 1,
          password: 1,
          notifications: 1,
          status: 1,
          role: 1,
          gender: 1,
          birthday: 1,
          images: 1,
          email: 1,
          whatsapp: 1,
          telegram: 1,
          instagram: 1,
          vk: 1,
          archive: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      )
      .lean()

    const userIds = users.map((user) => String(user._id))
    const eventUsersCounts = await db
      .model('EventsUsers')
      .aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
      ])

    const eventsCountByUserId = eventUsersCounts.reduce((acc, item) => {
      acc[String(item._id)] = item.count
      return acc
    }, {})

    const groupsByPhone = new Map()
    users.forEach((user) => {
      const normalizedPhone = normalizePhoneValue(user.phone)
      if (!isValidPhone(normalizedPhone)) return

      const userId = String(user._id)
      const userData = {
        _id: userId,
        label: getUserLabel(user),
        phone: user.phone,
        normalizedPhone,
        hasPassword: Boolean(String(user.password ?? '').trim()),
        notifications: user.notifications ?? null,
        status: user.status ?? '',
        role: user.role ?? '',
        gender: user.gender ?? null,
        birthday: user.birthday ?? null,
        images: Array.isArray(user.images) ? user.images.filter(Boolean) : [],
        email: user.email ?? '',
        whatsapp: user.whatsapp ?? null,
        telegram: user.telegram ?? '',
        instagram: user.instagram ?? '',
        vk: user.vk ?? '',
        firstName: user.firstName ?? '',
        secondName: user.secondName ?? '',
        thirdName: user.thirdName ?? '',
        archive: Boolean(user.archive),
        eventsUsersCount: eventsCountByUserId[userId] ?? 0,
        userUrl: `/${location}/user/${userId}`,
      }

      if (!groupsByPhone.has(normalizedPhone)) {
        groupsByPhone.set(normalizedPhone, [])
      }
      groupsByPhone.get(normalizedPhone).push(userData)
    })

    const groups = Array.from(groupsByPhone.entries())
      .filter(([, items]) => items.length > 1)
      .map(([phone, items]) => {
        const sortedItems = [...items].sort((a, b) => {
          if (b.eventsUsersCount !== a.eventsUsersCount) {
            return b.eventsUsersCount - a.eventsUsersCount
          }
          return a._id.localeCompare(b._id)
        })
        return {
          phone,
          count: sortedItems.length,
          suggestedPrimaryUserId: sortedItems[0]?._id || null,
          items: sortedItems,
        }
      })
      .sort((a, b) => b.count - a.count)

    return res?.status(200).json({
      success: true,
      data: {
        location,
        count: groups.length,
        groups,
      },
    })
  } catch (error) {
    console.error('users duplicates list error', error)
    return res?.status(500).json({
      success: false,
      data: {
        error: {
          type: 'internal_error',
          message: 'Failed to load duplicate users',
        },
      },
    })
  }
}
