import mongoose from 'mongoose'
import servicesUsersSchema from '@schemas/servicesUsersSchema'

const ServicesUsersSchema = new mongoose.Schema(servicesUsersSchema, {
  timestamps: true,
})

export default mongoose.models.ServicesUsers ||
  mongoose.model('ServicesUsers', ServicesUsersSchema)
