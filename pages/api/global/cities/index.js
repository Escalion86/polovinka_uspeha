import dbConnectGlobal from '@utils/dbConnectGlobal'
import getGlobalManagerSession from '@server/getGlobalManagerSession'
import {
  buildCityPoliciesFromCities,
  CITIES_CONTENT_KEY,
  normalizeCitiesList,
  normalizeCity,
} from '@server/citiesCatalog'
import { CITY_POLICIES_KEY, normalizePolicies } from '@server/getCityPolicy'

const getModel = (db) => db.model('GlobalContent')

const getCitiesFromDoc = (doc) => normalizeCitiesList(doc?.cities)

export default async function handler(req, res) {
  const { method, body } = req

  const { canManageGlobalContent } = await getGlobalManagerSession()
  if (!canManageGlobalContent) {
    return res.status(403).json({
      success: false,
      data: {
        error: {
          type: 'FORBIDDEN',
          message: 'Only dev and president can manage global cities',
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
      const doc = await getModel(db).findOne({ key: CITIES_CONTENT_KEY }).lean()
      const cities = getCitiesFromDoc(doc)

      return res.status(200).json({
        success: true,
        data: {
          cities,
          hasValue: cities.length > 0,
        },
      })
    }

    if (method === 'POST') {
      const inputCity = normalizeCity(body?.data?.city || {})
      if (!inputCity) {
        return res.status(400).json({
          success: false,
          data: {
            error: {
              type: 'VALIDATION_ERROR',
              message: 'City payload is invalid',
            },
          },
        })
      }

      const doc = await getModel(db).findOne({ key: CITIES_CONTENT_KEY }).lean()
      const cities = getCitiesFromDoc(doc)
      const exists = cities.some((city) => city.slug === inputCity.slug)

      if (exists) {
        return res.status(409).json({
          success: false,
          data: {
            error: {
              type: 'CITY_EXISTS',
              message: `City with slug "${inputCity.slug}" already exists`,
            },
          },
        })
      }

      const nextCities = normalizeCitiesList([
        ...cities,
        { ...inputCity, index: cities.length },
      ])

      const updatedCitiesDoc = await getModel(db).findOneAndUpdate(
        { key: CITIES_CONTENT_KEY },
        {
          key: CITIES_CONTENT_KEY,
          cities: nextCities,
          updatedBy: body?.userId ?? null,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

      await getModel(db).findOneAndUpdate(
        { key: CITY_POLICIES_KEY },
        {
          key: CITY_POLICIES_KEY,
          cityPolicies: {
            ...normalizePolicies(
              (await getModel(db).findOne({ key: CITY_POLICIES_KEY }).lean())
                ?.cityPolicies
            ),
            ...buildCityPoliciesFromCities(nextCities),
          },
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
          cities: normalizeCitiesList(updatedCitiesDoc?.cities),
          hasValue: true,
        },
      })
    }

    if (method === 'PUT') {
      const slug = String(body?.data?.slug || '').trim()
      const patch = body?.data?.city || {}

      if (!slug) {
        return res.status(400).json({
          success: false,
          data: {
            error: {
              type: 'VALIDATION_ERROR',
              message: 'City slug is required',
            },
          },
        })
      }

      const doc = await getModel(db).findOne({ key: CITIES_CONTENT_KEY }).lean()
      const cities = getCitiesFromDoc(doc)
      const index = cities.findIndex((city) => city.slug === slug)

      if (index < 0) {
        return res.status(404).json({
          success: false,
          data: {
            error: {
              type: 'CITY_NOT_FOUND',
              message: `City with slug "${slug}" not found`,
            },
          },
        })
      }

      const nextCities = [...cities]
      nextCities[index] = normalizeCity(
        { ...nextCities[index], ...patch, slug },
        nextCities[index]
      )
      const preparedCities = normalizeCitiesList(nextCities)

      const updatedCitiesDoc = await getModel(db).findOneAndUpdate(
        { key: CITIES_CONTENT_KEY },
        {
          key: CITIES_CONTENT_KEY,
          cities: preparedCities,
          updatedBy: body?.userId ?? null,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

      await getModel(db).findOneAndUpdate(
        { key: CITY_POLICIES_KEY },
        {
          key: CITY_POLICIES_KEY,
          cityPolicies: {
            ...normalizePolicies(
              (await getModel(db).findOne({ key: CITY_POLICIES_KEY }).lean())
                ?.cityPolicies
            ),
            ...buildCityPoliciesFromCities(preparedCities),
          },
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
          cities: normalizeCitiesList(updatedCitiesDoc?.cities),
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
    console.log('Global cities API error:', error)
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
