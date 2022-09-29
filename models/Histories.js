import mongoose from 'mongoose'
import historiesSchema from '@schemas/historiesSchema'

const HistoriesSchema = new mongoose.Schema(historiesSchema, {
  timestamps: { createdAt: true, updatedAt: false },
})

export default mongoose.models.Histories ||
  mongoose.model('Histories', HistoriesSchema)
