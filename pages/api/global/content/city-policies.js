import dbConnectGlobal from '@utils/dbConnectGlobal'
import {
  CITY_POLICIES_KEY,
  normalizeSinglePolicy,
  normalizePolicies,
} from '@server/getCityPolicy'
import { LOCATIONS_KEYS } from '@server/serverConstants'
import getGlobalManagerSession from '@server/getGlobalManagerSession'

const prepareIncomingPolicies = (payload) => {
  if (!payload || typeof payload !== 'object') return null

  const prepared = {}

  LOCATIONS_KEYS.forEach((location) => {
    prepared[location] = normalizeSinglePolicy(payload[location])
  })

  return prepared
}

const prepareIncomingPolicyPatch = (payload) => {
  const location = String(payload?.location || '').trim().toLowerCase()
  const policy = payload?.policy

  if (!location || !policy || typeof policy !== 'object') {
    return null
  }

  return {
    location,
    policy,
  }
}

export default async function handler(req, res) {
  const { method, body } = req
  const { canManageGlobalContent } = await getGlobalManagerSession(req, res)
  if (!canManageGlobalContent) {
    return res.status(403).json({
      success: false,
      data: {
        error: {
          type: 'FORBIDDEN',
          message: 'Only dev and president can manage city policies',
        },
      },
    })
  }

  const db = await dbConnectGlobal()
  if (!db) {
    return res.status(500).json({
      success: false,
      data: {
        error: {
          type: 'DB_ERROR',
          message: 'Global DB connection failed',
        },
      },
    })
  }

  try {
    if (method === 'GET') {
      const doc = await db
        .model('GlobalContent')
        .findOne({ key: CITY_POLICIES_KEY })
        .lean()

      const cityPolicies = normalizePolicies(doc?.cityPolicies)

      return res.status(200).json({
        success: true,
        data: {
          cityPolicies,
          hasValue: Boolean(doc?.cityPolicies),
        },
      })
    }

    if (method === 'POST') {
      const fullPoliciesPayload = body?.data?.cityPolicies
      const patchPayload = body?.data
      const preparedPolicies = prepareIncomingPolicies(fullPoliciesPayload)
      const preparedPatch = prepareIncomingPolicyPatch(patchPayload)

      if (!preparedPolicies && !preparedPatch) {
        return res.status(400).json({
          success: false,
          data: {
            error: {
              type: 'VALIDATION_ERROR',
              message:
                'Provide data.cityPolicies object or data.location + data.policy',
            },
          },
        })
      }

      const existingDoc = await db
        .model('GlobalContent')
        .findOne({ key: CITY_POLICIES_KEY })
        .lean()
      const basePolicies = normalizePolicies(existingDoc?.cityPolicies)
      const nextPolicies = preparedPolicies
        ? preparedPolicies
        : {
            ...basePolicies,
            [preparedPatch.location]: normalizeSinglePolicy(
              {
                ...(basePolicies?.[preparedPatch.location] || {}),
                ...preparedPatch.policy,
              },
              preparedPatch.location
            ),
          }

      const data = await db.model('GlobalContent').findOneAndUpdate(
        { key: CITY_POLICIES_KEY },
        {
          key: CITY_POLICIES_KEY,
          cityPolicies: nextPolicies,
          updatedBy: body?.userId ?? null,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

      return res.status(200).json({
        success: true,
        data: {
          cityPolicies: normalizePolicies(data?.cityPolicies),
          hasValue: true,
        },
      })
    }

    return res.status(405).json({
      success: false,
      data: {
        error: {
          type: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
        },
      },
    })
  } catch (error) {
    console.log('Global city-policies API error:', error)
    return res.status(500).json({
      success: false,
      data: {
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to process request',
        },
      },
    })
  }
}
