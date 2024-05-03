import mongoose from 'mongoose'
import toolsTemplatesSchema from '@schemas/toolsTemplatesSchema'

const ToolsTemplatesSchema = new mongoose.Schema(toolsTemplatesSchema, {
  timestamps: true,
})

export default mongoose.models.ToolsTemplates ||
  mongoose.model('ToolsTemplates', ToolsTemplatesSchema)
