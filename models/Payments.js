import mongoose from 'mongoose'
import paymentsSchema from '@schemas/paymentsSchema'

const PaymentsSchema = new mongoose.Schema(paymentsSchema, {
  timestamps: true,
})

export default mongoose.models.Payments ||
  mongoose.model('Payments', PaymentsSchema)
