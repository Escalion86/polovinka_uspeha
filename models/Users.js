import mongoose from 'mongoose'
import usersSchema from '@schemas/usersSchema'

const UsersSchema = new mongoose.Schema(usersSchema, { timestamps: true })

export default mongoose.models.Users || mongoose.model('Users', UsersSchema)
