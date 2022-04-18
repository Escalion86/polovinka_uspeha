import mongoose from 'mongoose'
import directionsSchema from '@schemas/directionsSchema'

const DirectionsSchema = new mongoose.Schema(directionsSchema, {
  timestamps: true,
})

export default mongoose.models.Directions ||
  mongoose.model('Directions', DirectionsSchema)
