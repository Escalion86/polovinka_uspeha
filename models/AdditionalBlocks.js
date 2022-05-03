import mongoose from 'mongoose'
import additionalBlocksSchema from '@schemas/additionalBlocksSchema'

const AdditionalBlocksSchema = new mongoose.Schema(additionalBlocksSchema, {
  timestamps: true,
})

export default mongoose.models.AdditionalBlocks ||
  mongoose.model('AdditionalBlocks', AdditionalBlocksSchema)
