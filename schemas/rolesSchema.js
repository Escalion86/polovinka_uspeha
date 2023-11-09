const rolesSchema = {
  seeFullUsersNames: {
    type: Boolean,
    default: false,
  },
  seeAllContactsOfUsers: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: {},
    default: {
      option: false,
      birthdays: false,
      newUserRegistred: false,
      eventRegistration: false,
      newEventsByTags: false,
      eventUserMoves: false,
      eventCancel: false,
    },
  },
  seeBirthdayOfUsers: {
    type: Boolean,
    default: false,
  },
  eventUsersCounterAndAgeFull: {
    type: Boolean,
    default: false,
  },
  eventStatusFilterFull: {
    type: Boolean,
    default: false,
  },
  seeUserSumOfPaymentsWithoutEvent: {
    type: Boolean,
    default: false,
  },
  events: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  eventsUsers: {
    type: {},
    default: {
      see: true,
      edit: false,
    },
  },
  users: {
    type: {},
    default: {
      see: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  directions: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  services: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  servicesUsers: {
    type: {},
    default: {
      see: true,
      edit: false,
    },
  },
  products: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  productsUsers: {
    type: {},
    default: {
      see: true,
      edit: false,
    },
  },
  additionalBlocks: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
    },
  },
  editSiteSettings: {
    type: Boolean,
    default: false,
  },
  setSelfStatus: {
    type: Boolean,
    default: false,
  },
  setSelfRole: {
    type: Boolean,
    default: false,
  },
  fabInCabinet: {
    type: Boolean,
    default: false,
  },
}

export default rolesSchema
