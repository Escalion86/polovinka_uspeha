import mongoose from 'mongoose'
import siteSettingsSchema from '@schemas/siteSettingsSchema'

const SiteSettingsSchema = new mongoose.Schema(siteSettingsSchema, {
  timestamps: true,
})

export default mongoose.models.SiteSettings ||
  mongoose.model('SiteSettings', SiteSettingsSchema)
