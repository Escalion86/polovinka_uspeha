import mongoose from 'mongoose'
import siteSchema from '@schemas/siteSchema'

const SiteSchema = new mongoose.Schema(siteSchema, { timestamps: true })

export default mongoose.models.Site || mongoose.model('Site', SiteSchema)
