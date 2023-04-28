import mongoose from 'mongoose'
import loginHistorySchema from '@schemas/loginHistorySchema'

const LoginHistorySchema = new mongoose.Schema(loginHistorySchema, {
  timestamps: true,
})

export default mongoose.models.LoginHistory ||
  mongoose.model('LoginHistory', LoginHistorySchema)
