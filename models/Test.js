import mongoose from 'mongoose'
import testSchema from '@schemas/testSchema'

const TestSchema = new mongoose.Schema(testSchema, {
  timestamps: true,
})

export default mongoose.models.Test || mongoose.model('Test', TestSchema)
