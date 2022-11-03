import mongoose from 'mongoose'
import questionnairesSchema from '@schemas/questionnairesSchema'

const QuestionnairesSchema = new mongoose.Schema(questionnairesSchema, {
  timestamps: true,
})

export default mongoose.models.Questionnaires ||
  mongoose.model('Questionnaires', QuestionnairesSchema)
