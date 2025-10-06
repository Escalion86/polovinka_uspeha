const rolesSchema = {
  name: {
    type: String,
    require: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  dev: {
    type: Boolean,
    default: false,
  },
  seeMyStatistics: { type: Boolean, default: false },
  setSelfStatus: {
    type: Boolean,
    default: false,
  },
  setSelfRole: {
    type: Boolean,
    default: false,
  },
  hideFab: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: {},
    default: {
      birthdays: false,
      newUserRegistred: false,
      eventRegistration: false,
      newEventsByTags: false,
      // eventUserMoves: false,
      // eventCancel: false,
    },
  },
  events: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
      paymentsEdit: false,
      showProfitOnCard: false,
      eventUsersCounterAndAgeFull: false,
    },
  },
  eventsUsers: {
    type: {},
    default: {
      see: false,
      edit: false,
      copyListToClipboard: false,
    },
  },
  users: {
    type: {},
    default: {
      see: false,
      seeMembersOnly: false,
      add: false,
      edit: false,
      setRole: false,
      setStatus: false,
      delete: false,
      seeFullNames: false,
      seeAllContacts: false,
      seeBirthday: false,
      seeUserEvents: false,
      seeUserPayments: false,
      setPassword: false,
      seeSumOfPaymentsWithoutEventOnCard: false,
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
      see: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
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
      see: false,
      add: false,
      edit: false,
      delete: false,
      statusEdit: false,
    },
  },
  payments: {
    type: {},
    default: {
      see: true,
      seeHidden: false,
      add: false,
      edit: false,
      delete: false,
      paymentsNotParticipantsEvent: false,
      paymentsWithNoEvent: false,
    },
  },
  statistics: {
    type: {},
    default: {
      events: false,
      users: false,
      finances: false,
    },
  },
  instruments: {
    type: {},
    default: {
      anonsTextGenerator: false,
      anonsEventImageGenerator: false,
      anonsEventListImageGenerator: false,
      export: false,
      newsletter: false,
    },
  },
  generalPage: {
    type: {},
    default: {
      directions: false,
      additionalBlocks: false,
      reviews: false,
      contacts: false,
    },
  },
  siteSettings: {
    type: {},
    default: {
      phoneConfirmService: false,
      fabMenu: false,
      referralSystem: false,
      achievements: false,
      roles: false,
    },
  },
  notices: {
    type: {},
    default: {
      histories: false,
      birthdays: false,
    },
  },
}

export default rolesSchema
