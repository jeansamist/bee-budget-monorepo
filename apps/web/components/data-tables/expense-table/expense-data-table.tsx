import { Expense } from "@/types"
import { FunctionComponent } from "react"
import { DataTable } from "../data-table"
import { columns } from "./columns"

export const ExpenseDataTable: FunctionComponent<{
  expenses: Expense[]
  handleRowSelection?: (state: Expense[]) => void
  resetSelectionTrigger?: unknown
  onDeleted?: () => void
}> = ({ expenses, handleRowSelection, resetSelectionTrigger, onDeleted }) => {
  return (
    <DataTable<Expense, unknown>
      columns={columns}
      data={expenses}
      handleRowSelection={handleRowSelection}
      resetSelectionTrigger={resetSelectionTrigger}
      onDeleted={onDeleted}
    />
  )
}
