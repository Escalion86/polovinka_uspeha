import mongoose from 'mongoose'
import eventsUsersSchema from '@schemas/eventsUsersSchema'

const EventsUsersSchema = new mongoose.Schema(eventsUsersSchema, {
  timestamps: true,
})

export default mongoose.models.EventsUsers ||
  mongoose.model('EventsUsers', EventsUsersSchema)
