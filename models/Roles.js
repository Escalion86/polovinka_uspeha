import mongoose from 'mongoose'
import rolesSchema from '@schemas/rolesSchema'

const RolesSchema = new mongoose.Schema(rolesSchema, {
  timestamps: true,
})

export default mongoose.models.Roles || mongoose.model('Roles', RolesSchema)
