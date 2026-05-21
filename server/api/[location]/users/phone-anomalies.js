import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import {
  getPhoneAnomalyReasons,
  normalizePhoneValue,
} from '@helpers/phoneUtils'

const reasonLabels = {
  empty: 'Пустой номер',
  invalid_length: 'Некорректная длина номера',
  invalid_prefix: 'Некорректный префикс номера',
  double_country_code_7: 'Похоже на лишнюю 7 после кода страны',
  starts_with_8: 'Номер начинается с 8 (требуется нормализация к 7)',
  needs_normalization: 'Номер хранится не в нормализованном формате',
}

const fullName = (user) =>
  [user?.firstName, user?.secondName].filter(Boolean).join(' ').trim()

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
    if (!db)
      return res?.status(500).json({
        success: false,
        data: {
          error: {
            type: 'db_error',
            message: 'db error',
          },
        },
      })

    const users = await db
      .model('Users')
      .find(
        { phone: { $ne: null } },
        {
          _id: 1,
          firstName: 1,
          secondName: 1,
          phone: 1,
          role: 1,
          status: 1,
          createdAt: 1,
        }
      )
      .lean()

    const items = users
      .map((user) => {
        const rawPhone = String(user.phone ?? '')
        const normalizedPhone = normalizePhoneValue(rawPhone)
        const reasons = getPhoneAnomalyReasons(rawPhone)

        if (rawPhone && normalizedPhone && rawPhone !== normalizedPhone) {
          reasons.push('needs_normalization')
        }

        return {
          _id: String(user._id),
          name: fullName(user) || '[без имени]',
          phone: rawPhone,
          normalizedPhone,
          role: user.role ?? null,
          status: user.status ?? null,
          createdAt: user.createdAt ?? null,
          reasons,
          reasonLabels: reasons.map((reason) => reasonLabels[reason] ?? reason),
          userUrl: `/${location}/user/${user._id}`,
        }
      })
      .filter((item) => item.reasons.length > 0)

    return res
      ?.status(200)
      .json({ success: true, data: { location, count: items.length, items } })
  } catch (error) {
    console.error('phone-anomalies error', error)
    return res?.status(500).json({
      success: false,
      data: {
        error: {
          type: 'internal_error',
          message: 'Failed to load phone anomalies',
        },
      },
    })
  }
}
