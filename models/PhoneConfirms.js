import mongoose from 'mongoose'
import phoneConfirmsSchema from '@schemas/phoneConfirmsSchema'

const PhoneConfirmsSchema = new mongoose.Schema(phoneConfirmsSchema, {
  timestamps: true,
})

export default mongoose.models.PhoneConfirms ||
  mongoose.model('PhoneConfirms', PhoneConfirmsSchema)
