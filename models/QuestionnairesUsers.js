import mongoose from 'mongoose'
import questionnairesUsersSchema from '@schemas/questionnairesUsersSchema'

const QuestionnairesUsersSchema = new mongoose.Schema(
  questionnairesUsersSchema,
  {
    timestamps: true,
  }
)

export default mongoose.models.QuestionnairesUsers ||
  mongoose.model('QuestionnairesUsers', QuestionnairesUsersSchema)
