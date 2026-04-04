"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { deleteMassExpenses, getExpenses } from "@/services/expenses.services"
import { Expense } from "@/types"
import { Button } from "@bee-budget/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bee-budget/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bee-budget/ui/select"
import { Loader, Trash } from "lucide-react"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { Confirm } from "../confirm"
import { ExpenseDataTable } from "../data-tables/expense-table/expense-data-table"

export type LastExpensesProps = {
  [key: string]: unknown
}

export const LastExpenses: FunctionComponent<LastExpensesProps> = () => {
  const t = useScopedI18n("app.dashboard.lastExpenses")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [deleting, setDeleting] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Expense[]>([])
  const [perPage, setPerPage] = useState<number>(5)
  const [fetchVersion, setFetchVersion] = useState(0)

  useEffect(() => {
    ;(async () => {
      const response = await getExpenses({ perPage })
      if (response.success) {
        setExpenses(response.data ?? [])
      }
    })()
  }, [perPage, fetchVersion])

  const handleRowSelection = useCallback((rows: Expense[]) => {
    setSelectedRows(rows)
  }, [])

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => !selectedRows.includes(expense))
    )
    await deleteMassExpenses(selectedRows.map((expense) => expense.id))
    setDeleting(false)
    setSelectedRows([])
    setFetchVersion((version) => version + 1)
  }, [selectedRows])

  return (
    <div className="px-4">
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <CardAction className="hidden gap-2 md:flex">
            {selectedRows.length > 0 && (
              <Confirm
                title={t("deleteConfirm.title")}
                content={t("deleteConfirm.content")}
                confirmText={t("deleteConfirm.confirm")}
                onConfirm={() => handleDelete()}
              >
                <Button variant={"destructive"} disabled={deleting}>
                  {deleting ? <Loader className="animate-spin" /> : <Trash />}
                  {deleting
                    ? t("deleting")
                    : t("deleteCount", {
                        count: selectedRows.length.toString().padStart(2, "0"),
                      })}
                </Button>
              </Confirm>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ExpenseDataTable
            expenses={expenses}
            handleRowSelection={handleRowSelection}
            resetSelectionTrigger={fetchVersion}
            onDeleted={() => setFetchVersion((version) => version + 1)}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(Number(value))}
            defaultValue="5"
          >
            <SelectTrigger>
              <SelectValue placeholder={t("perPage.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
    </div>
  )
}
