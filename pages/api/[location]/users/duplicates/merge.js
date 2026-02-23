import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import { normalizePhoneValue } from '@helpers/phoneUtils'
import assertCityOperationAllowed from '@server/assertCityOperationAllowed'

const isValidPhone = (phone) => /^7\d{10}$/.test(String(phone || ''))

const ALLOWED_MERGE_FIELDS = [
  'firstName',
  'secondName',
  'thirdName',
  'gender',
  'birthday',
  'email',
  'whatsapp',
  'telegram',
  'instagram',
  'vk',
  'status',
  'role',
  'password',
  'notifications',
]

const sanitizeUndefinedStringsDeep = (value) => {
  if (value === 'undefined') return undefined

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeUndefinedStringsDeep(item))
      .filter((item) => item !== undefined)
  }

  if (value && typeof value === 'object') {
    const next = {}
    Object.entries(value).forEach(([key, innerValue]) => {
      const sanitized = sanitizeUndefinedStringsDeep(innerValue)
      if (sanitized !== undefined) {
        next[key] = sanitized
      }
    })
    return next
  }

  return value
}

export default async function handler(req, res) {
  const { method, query, body } = req
  const location = query?.location

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
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

  const {
    phone,
    primaryUserId,
    secondaryUserIds = [],
    fieldSourceByField = {},
    dryRun = false,
  } = body || {}

  if (!phone || !primaryUserId || !Array.isArray(secondaryUserIds)) {
    return res?.status(400).json({
      success: false,
      data: {
        error: {
          type: 'validation_error',
          message: 'Недостаточно параметров для merge',
        },
      },
    })
  }

  const normalizedPhone = normalizePhoneValue(phone)
  if (!isValidPhone(normalizedPhone)) {
    return res?.status(400).json({
      success: false,
      data: {
        error: {
          type: 'validation_error',
          message: 'Некорректный номер телефона',
        },
      },
    })
  }

  try {
    const eventManagementGuard = await assertCityOperationAllowed(
      location,
      'event_management'
    )
    if (!eventManagementGuard.success) {
      return res?.status(403).json(eventManagementGuard)
    }

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

    const allIds = [primaryUserId, ...secondaryUserIds].filter(Boolean)
    const uniqueIds = Array.from(new Set(allIds.map((id) => String(id))))

    if (uniqueIds.length < 2) {
      return res?.status(400).json({
        success: false,
        data: {
          error: {
            type: 'validation_error',
            message: 'Для merge нужно минимум 2 аккаунта',
          },
        },
      })
    }

    const users = await db
      .model('Users')
      .find(
        { _id: { $in: uniqueIds } },
        {
          _id: 1,
          phone: 1,
          firstName: 1,
          secondName: 1,
          thirdName: 1,
          gender: 1,
          birthday: 1,
          email: 1,
          whatsapp: 1,
          telegram: 1,
          instagram: 1,
          vk: 1,
          status: 1,
          role: 1,
          password: 1,
          notifications: 1,
        }
      )
      .lean()

    if (users.length !== uniqueIds.length) {
      return res?.status(404).json({
        success: false,
        data: {
          error: {
            type: 'not_found',
            message: 'Не все пользователи найдены',
          },
        },
      })
    }

    const usersById = users.reduce((acc, user) => {
      acc[String(user._id)] = user
      return acc
    }, {})

    for (const id of uniqueIds) {
      const user = usersById[id]
      const userPhone = normalizePhoneValue(user?.phone)
      if (userPhone !== normalizedPhone) {
        return res?.status(400).json({
          success: false,
          data: {
            error: {
              type: 'validation_error',
              message:
                'Нельзя объединять пользователей с разными номерами телефона',
            },
          },
        })
      }
    }

    const primaryId = String(primaryUserId)
    const secondaries = uniqueIds.filter((id) => id !== primaryId)
    if (secondaries.length === 0) {
      return res?.status(400).json({
        success: false,
        data: {
          error: {
            type: 'validation_error',
            message: 'Не выбраны вторичные аккаунты для merge',
          },
        },
      })
    }

    const primaryUser = usersById[primaryId]
    const mergeUpdate = { phone: normalizedPhone }
    ALLOWED_MERGE_FIELDS.forEach((field) => {
      const sourceId = fieldSourceByField?.[field]
      if (!sourceId) return
      const sourceUser = usersById[String(sourceId)]
      if (!sourceUser) return

      if (field === 'notifications') {
        mergeUpdate[field] = sanitizeUndefinedStringsDeep(
          sourceUser[field] ?? {}
        )
        return
      }

      mergeUpdate[field] = sourceUser[field] ?? null
    })

    const transferResult = {
      movedEventUsers: 0,
      sameEventPairsAfterMerge: 0,
      updatedPrimaryFields: Object.keys(mergeUpdate),
      secondaryAccounts: secondaries,
      deletedSecondaryAccounts: dryRun ? secondaries.length : 0,
      details: [],
    }

    const primaryEventUsers = await db
      .model('EventsUsers')
      .find({ userId: primaryId }, { eventId: 1, subEventId: 1 })
      .lean()
    const primaryPairs = new Set(
      primaryEventUsers.map(
        (item) => `${String(item.eventId)}::${String(item.subEventId ?? '')}`
      )
    )

    for (const secondaryId of secondaries) {
      const eventsUsers = await db
        .model('EventsUsers')
        .find({ userId: secondaryId })
        .lean()

      let secondaryMoved = 0
      let secondarySamePairs = 0

      for (const eventUser of eventsUsers) {
        const pairKey = `${String(eventUser.eventId)}::${String(
          eventUser.subEventId ?? ''
        )}`

        if (primaryPairs.has(pairKey)) {
          transferResult.sameEventPairsAfterMerge += 1
          secondarySamePairs += 1
        }

        transferResult.movedEventUsers += 1
        secondaryMoved += 1
        primaryPairs.add(pairKey) // для расчета dry-run статистики
        if (!dryRun) {
          await db
            .model('EventsUsers')
            .findByIdAndUpdate(eventUser._id, { userId: primaryId })
        }
      }

      transferResult.details.push({
        secondaryUserId: secondaryId,
        movedEventUsers: secondaryMoved,
        sameEventPairsAfterMerge: secondarySamePairs,
      })
    }

    if (!dryRun) {
      await db.model('Users').findByIdAndUpdate(primaryId, mergeUpdate)
      const deleteResult = await db
        .model('Users')
        .deleteMany({ _id: { $in: secondaries } })
      transferResult.deletedSecondaryAccounts = deleteResult?.deletedCount ?? 0

      await db.model('Histories').create({
        schema: 'users',
        action: 'merge',
        data: {
          phone: normalizedPhone,
          primaryUserId: primaryId,
          secondaryUserIds: secondaries,
          transferResult,
        },
        userId: primaryId,
      })
    }

    return res?.status(200).json({
      success: true,
      data: {
        location,
        phone: normalizedPhone,
        primaryUserId: primaryId,
        primaryUserUrl: `/${location}/user/${primaryId}`,
        dryRun: Boolean(dryRun),
        transferResult,
      },
    })
  } catch (error) {
    console.error('users duplicates merge error', error)
    return res?.status(500).json({
      success: false,
      data: {
        error: {
          type: 'internal_error',
          message: 'Failed to merge duplicate users',
        },
      },
    })
  }
}
