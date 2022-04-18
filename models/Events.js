import mongoose from 'mongoose'
import eventsSchema from '@schemas/eventsSchema'

const EventsSchema = new mongoose.Schema(eventsSchema, { timestamps: true })

export default mongoose.models.Events || mongoose.model('Events', EventsSchema)
