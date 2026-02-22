import checkLocationValid from './checkLocationValid'
import getCityPolicy from './getCityPolicy'

const operationToFlag = {
  registration: 'allowRegistration',
  login: 'allowLogin',
  event_signup: 'allowEventSignup',
  event_management: 'allowEventManagement',
  public_listing: 'allowPublicListing',
  vk_auth: 'allowVkAuth',
}

const assertCityOperationAllowed = async (location, operation) => {
  if (!checkLocationValid(location)) {
    return {
      success: false,
      data: {
        error: {
          type: 'INVALID_LOCATION',
          message: 'Location is invalid',
        },
      },
    }
  }

  const flagName = operationToFlag[operation]
  if (!flagName) {
    return {
      success: false,
      data: {
        error: {
          type: 'INVALID_CITY_OPERATION',
          message: 'Operation mode is invalid',
        },
      },
    }
  }

  const policyResult = await getCityPolicy(location)
  if (!policyResult.success) {
    return policyResult
  }

  const policy = policyResult.data.policy
  const allowed = Boolean(policy?.[flagName])

  if (!allowed) {
    return {
      success: false,
      data: {
        error: {
          type: 'CITY_OPERATION_BLOCKED',
          message: `Operation "${operation}" is not allowed for "${location}"`,
        },
        location,
        operation,
        status: policy?.status || 'active',
        policy,
      },
    }
  }

  return {
    success: true,
    data: {
      location,
      operation,
      status: policy?.status || 'active',
      policy,
    },
  }
}

export default assertCityOperationAllowed
