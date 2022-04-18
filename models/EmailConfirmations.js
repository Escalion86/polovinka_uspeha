import mongoose from 'mongoose'
import emailConfirmationsSchema from '@schemas/emailConfirmationsSchema'

const EmailConfirmationsSchema = new mongoose.Schema(emailConfirmationsSchema)

export default mongoose.models.EmailConfirmations ||
  mongoose.model('EmailConfirmations', EmailConfirmationsSchema)
