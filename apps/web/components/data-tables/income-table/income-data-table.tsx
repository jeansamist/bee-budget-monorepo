import { Income } from "@/types"
import { FunctionComponent } from "react"
import { DataTable } from "../data-table"
import { columns } from "./columns"

export const IncomeDataTable: FunctionComponent<{
  incomes: Income[]
  handleRowSelection?: (state: Income[]) => void
  resetSelectionTrigger?: unknown
}> = ({ incomes, handleRowSelection, resetSelectionTrigger }) => {
  return (
    <DataTable<Income, unknown>
      columns={columns}
      data={incomes}
      handleRowSelection={handleRowSelection}
      resetSelectionTrigger={resetSelectionTrigger}
    />
  )
}
