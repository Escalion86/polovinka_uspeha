import mongoose from 'mongoose'
import servicesSchema from '@schemas/servicesSchema'

const ServicesSchema = new mongoose.Schema(servicesSchema, {
  timestamps: true,
})

export default mongoose.models.Services ||
  mongoose.model('Services', ServicesSchema)
