import mongoose from 'mongoose'
import eventsTagsSchema from '@schemas/eventsTagsSchema'

const EventsTagsSchema = new mongoose.Schema(eventsTagsSchema, {
  timestamps: true,
})

export default mongoose.models.EventsTags ||
  mongoose.model('EventsTags', EventsTagsSchema)
