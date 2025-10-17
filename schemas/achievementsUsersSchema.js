import { Schema } from 'mongoose'

const achievementsUsersSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  achievementId: {
    type: Schema.Types.ObjectId,
    ref: 'Achievements',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Events',
    default: null,
  },
  eventName: {
    type: String,
    default: '',
  },
  comment: {
    type: String,
    default: '',
  },
  viewedAt: {
    type: Date,
    default: null,
  },
  issuedAt: {
    type: Date,
    default: () => Date.now(),
  },
}

export default achievementsUsersSchema
