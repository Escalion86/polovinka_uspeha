import ExportIndividualWeddings from './ToolsExport/ExportIndividualWeddings'
import ExportUsers from './ToolsExport/ExportUsers'

const ToolsExportContent = () => {
  return (
    <div className="flex flex-col items-start h-full max-h-full p-1 overflow-y-auto gap-y-2">
      <ExportIndividualWeddings />
      <ExportUsers />
    </div>
  )
}

export default ToolsExportContent
