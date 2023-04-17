import mongoose from 'mongoose'
import productsSchema from '@schemas/productsSchema'

const ProductsSchema = new mongoose.Schema(productsSchema, {
  timestamps: true,
})

export default mongoose.models.Products ||
  mongoose.model('Products', ProductsSchema)
