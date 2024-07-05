import mongoose from 'mongoose'
import remindDatesSchema from '@schemas/remindDatesSchema'

const RemindDatesSchema = new mongoose.Schema(remindDatesSchema, {
  timestamps: true,
})

export default mongoose.models.RemindDates ||
  mongoose.model('RemindDates', RemindDatesSchema)
