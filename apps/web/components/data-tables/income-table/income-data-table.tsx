import { Income } from "@/types"
import { FunctionComponent } from "react"
import { DataTable } from "../data-table"
import { columns } from "./columns"

export const IncomeDataTable: FunctionComponent<{ incomes: Income[] }> = ({
  incomes,
}) => {
  return <DataTable columns={columns} data={incomes} />
}
