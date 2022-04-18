import mongoose from 'mongoose'
import reviewsSchema from '@schemas/reviewsSchema'

const ReviewsSchema = new mongoose.Schema(reviewsSchema, { timestamps: true })

export default mongoose.models.Reviews ||
  mongoose.model('Reviews', ReviewsSchema)
