import { InternalTransfer } from "@/types"
import { FunctionComponent } from "react"
import { DataTable } from "../data-table"
import { columns } from "./columns"

export const InternalTransferDataTable: FunctionComponent<{
  transfers: InternalTransfer[]
  handleRowSelection?: (state: InternalTransfer[]) => void
  resetSelectionTrigger?: unknown
  onDeleted?: () => void
}> = ({ transfers, handleRowSelection, resetSelectionTrigger, onDeleted }) => {
  return (
    <DataTable<InternalTransfer, unknown>
      columns={columns}
      data={transfers}
      handleRowSelection={handleRowSelection}
      resetSelectionTrigger={resetSelectionTrigger}
      onDeleted={onDeleted}
    />
  )
}
