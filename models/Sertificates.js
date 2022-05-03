import mongoose from 'mongoose'
import sertificatesSchema from '@schemas/sertificatesSchema'

const SertificatesSchema = new mongoose.Schema(sertificatesSchema, {
  timestamps: true,
})

export default mongoose.models.Sertificates ||
  mongoose.model('Sertificates', SertificatesSchema)
