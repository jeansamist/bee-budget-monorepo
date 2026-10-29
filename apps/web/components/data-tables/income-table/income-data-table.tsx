import { Income } from "@/types"
import { FunctionComponent } from "react"
import { DataTable } from "../data-table"
import { columns, IncomeMobileCard } from "./columns"

export const IncomeDataTable: FunctionComponent<{
  incomes: Income[]
  handleRowSelection?: (state: Income[]) => void
  resetSelectionTrigger?: unknown
  onDeleted?: () => void
}> = ({ incomes, handleRowSelection, resetSelectionTrigger, onDeleted }) => {
  return (
    <DataTable<Income, unknown>
      columns={columns}
      data={incomes}
      handleRowSelection={handleRowSelection}
      resetSelectionTrigger={resetSelectionTrigger}
      onDeleted={onDeleted}
      renderMobileCard={(row, table) => (
        <IncomeMobileCard row={row} table={table} />
      )}
      canSelectRow={(income) => !income.internalTransferId}
    />
  )
}
